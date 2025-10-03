package com.usradio.app;

import android.os.Bundle;
import android.os.Handler;
import android.os.Looper;
import android.view.View;
import android.widget.ImageButton;
import android.widget.ImageView;
import android.widget.ProgressBar;
import android.widget.TextView;
import android.widget.Toast;
import androidx.appcompat.app.AppCompatActivity;
import androidx.appcompat.widget.SearchView;
import androidx.recyclerview.widget.LinearLayoutManager;
import androidx.recyclerview.widget.RecyclerView;
import com.bumptech.glide.Glide;
import com.google.android.material.card.MaterialCardView;
import com.google.android.material.tabs.TabLayout;
import com.usradio.app.adapter.RadioStationAdapter;
import com.usradio.app.api.RetrofitClient;
import com.usradio.app.model.RadioStation;
import com.usradio.app.player.RadioPlayer;
import com.usradio.app.repository.RadioRepository;
import java.util.ArrayList;
import java.util.List;
import retrofit2.Call;
import retrofit2.Callback;
import retrofit2.Response;

public class MainActivity extends AppCompatActivity implements RadioStationAdapter.OnStationClickListener {
    
    private RecyclerView recyclerView;
    private RadioStationAdapter adapter;
    private ProgressBar progressBar;
    private SearchView searchView;
    private TabLayout tabLayout;
    
    // Player UI
    private MaterialCardView playerCard;
    private ImageView playerIcon;
    private TextView playerStationName;
    private TextView playerStatus;
    private ImageButton btnPlayPause;
    private ImageButton btnClose;
    
    private RadioPlayer radioPlayer;
    private RadioRepository repository;
    
    private List<RadioStation> allStations = new ArrayList<>();
    private List<RadioStation> favoriteStations = new ArrayList<>();
    private boolean showingFavorites = false;
    
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);
        
        initViews();
        setupRecyclerView();
        setupPlayer();
        setupRepository();
        setupTabLayout();
        setupSearchView();
        
        loadStations();
    }
    
    private void initViews() {
        recyclerView = findViewById(R.id.recyclerView);
        progressBar = findViewById(R.id.progressBar);
        searchView = findViewById(R.id.searchView);
        tabLayout = findViewById(R.id.tabLayout);
        
        playerCard = findViewById(R.id.playerCard);
        playerIcon = findViewById(R.id.playerIcon);
        playerStationName = findViewById(R.id.playerStationName);
        playerStatus = findViewById(R.id.playerStatus);
        btnPlayPause = findViewById(R.id.btnPlayPause);
        btnClose = findViewById(R.id.btnClose);
    }
    
    private void setupRecyclerView() {
        adapter = new RadioStationAdapter(this);
        recyclerView.setLayoutManager(new LinearLayoutManager(this));
        recyclerView.setAdapter(adapter);
    }
    
    private void setupPlayer() {
        radioPlayer = new RadioPlayer(this);
        radioPlayer.setPlayerStateListener(new RadioPlayer.PlayerStateListener() {
            @Override
            public void onPlayerReady() {
                runOnUiThread(() -> {
                    playerStatus.setText("Playing");
                    btnPlayPause.setImageResource(android.R.drawable.ic_media_pause);
                });
            }
            
            @Override
            public void onPlayerError(String error) {
                runOnUiThread(() -> {
                    playerStatus.setText("Error: " + error);
                    Toast.makeText(MainActivity.this, "Playback error: " + error, Toast.LENGTH_SHORT).show();
                });
            }
            
            @Override
            public void onPlaybackStateChanged(boolean isPlaying) {
                runOnUiThread(() -> {
                    if (isPlaying) {
                        btnPlayPause.setImageResource(android.R.drawable.ic_media_pause);
                        playerStatus.setText("Playing");
                    } else {
                        btnPlayPause.setImageResource(android.R.drawable.ic_media_play);
                        playerStatus.setText("Paused");
                    }
                });
            }
        });
        
        btnPlayPause.setOnClickListener(v -> {
            if (radioPlayer.isPlaying()) {
                radioPlayer.pause();
            } else {
                radioPlayer.play();
            }
        });
        
        btnClose.setOnClickListener(v -> {
            radioPlayer.stop();
            playerCard.setVisibility(View.GONE);
        });
    }
    
    private void setupRepository() {
        repository = new RadioRepository(this);
        repository.getAllFavorites().observe(this, favorites -> {
            favoriteStations = favorites != null ? favorites : new ArrayList<>();
            updateFavoriteStatus();
            if (showingFavorites) {
                adapter.setStations(favoriteStations);
            }
        });
    }
    
    private void setupTabLayout() {
        tabLayout.addOnTabSelectedListener(new TabLayout.OnTabSelectedListener() {
            @Override
            public void onTabSelected(TabLayout.Tab tab) {
                showingFavorites = tab.getPosition() == 1;
                if (showingFavorites) {
                    adapter.setStations(favoriteStations);
                } else {
                    adapter.setStations(allStations);
                }
                searchView.setQuery("", false);
            }
            
            @Override
            public void onTabUnselected(TabLayout.Tab tab) {}
            
            @Override
            public void onTabReselected(TabLayout.Tab tab) {}
        });
    }
    
    private void setupSearchView() {
        searchView.setOnQueryTextListener(new SearchView.OnQueryTextListener() {
            @Override
            public boolean onQueryTextSubmit(String query) {
                return false;
            }
            
            @Override
            public boolean onQueryTextChange(String newText) {
                filterStations(newText);
                return true;
            }
        });
    }
    
    private void filterStations(String query) {
        List<RadioStation> sourceList = showingFavorites ? favoriteStations : allStations;
        
        if (query == null || query.trim().isEmpty()) {
            adapter.setStations(sourceList);
            return;
        }
        
        List<RadioStation> filtered = new ArrayList<>();
        String lowerQuery = query.toLowerCase();
        
        for (RadioStation station : sourceList) {
            if (station.getName() != null && station.getName().toLowerCase().contains(lowerQuery)) {
                filtered.add(station);
            } else if (station.getTags() != null && station.getTags().toLowerCase().contains(lowerQuery)) {
                filtered.add(station);
            } else if (station.getState() != null && station.getState().toLowerCase().contains(lowerQuery)) {
                filtered.add(station);
            }
        }
        
        adapter.setStations(filtered);
    }
    
    private void loadStations() {
        progressBar.setVisibility(View.VISIBLE);
        
        RetrofitClient.getInstance()
            .getRadioBrowserService()
            .getUSAStations(1000, 0, "votes", true)
            .enqueue(new Callback<List<RadioStation>>() {
                @Override
                public void onResponse(Call<List<RadioStation>> call, Response<List<RadioStation>> response) {
                    progressBar.setVisibility(View.GONE);
                    if (response.isSuccessful() && response.body() != null) {
                        allStations = response.body();
                        updateFavoriteStatus();
                        adapter.setStations(allStations);
                    } else {
                        Toast.makeText(MainActivity.this, "Error loading stations", Toast.LENGTH_SHORT).show();
                    }
                }
                
                @Override
                public void onFailure(Call<List<RadioStation>> call, Throwable t) {
                    progressBar.setVisibility(View.GONE);
                    Toast.makeText(MainActivity.this, "Network error: " + t.getMessage(), Toast.LENGTH_SHORT).show();
                }
            });
    }
    
    private void updateFavoriteStatus() {
        new Thread(() -> {
            for (RadioStation station : allStations) {
                boolean isFav = false;
                for (RadioStation fav : favoriteStations) {
                    if (fav.getStationUuid().equals(station.getStationUuid())) {
                        isFav = true;
                        break;
                    }
                }
                station.setFavorite(isFav);
            }
            runOnUiThread(() -> adapter.notifyDataSetChanged());
        }).start();
    }
    
    @Override
    public void onStationClick(RadioStation station) {
        playerCard.setVisibility(View.VISIBLE);
        playerStationName.setText(station.getName());
        playerStatus.setText("Loading...");
        
        if (station.getFavicon() != null && !station.getFavicon().isEmpty()) {
            Glide.with(this)
                .load(station.getFavicon())
                .placeholder(android.R.drawable.ic_btn_speak_now)
                .error(android.R.drawable.ic_btn_speak_now)
                .into(playerIcon);
        } else {
            playerIcon.setImageResource(android.R.drawable.ic_btn_speak_now);
        }
        
        radioPlayer.playStation(station);
    }
    
    @Override
    public void onFavoriteClick(RadioStation station) {
        station.setFavorite(!station.isFavorite());
        
        if (station.isFavorite()) {
            repository.insertFavorite(station);
            Toast.makeText(this, "Added to favorites", Toast.LENGTH_SHORT).show();
        } else {
            repository.deleteFavoriteById(station.getStationUuid());
            Toast.makeText(this, "Removed from favorites", Toast.LENGTH_SHORT).show();
        }
        
        adapter.updateStation(station);
    }
    
    @Override
    protected void onDestroy() {
        super.onDestroy();
        if (radioPlayer != null) {
            radioPlayer.release();
        }
    }
}
