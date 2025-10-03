package com.usradio.app

import android.content.ComponentName
import android.content.Context
import android.content.Intent
import android.content.ServiceConnection
import android.os.Bundle
import android.os.IBinder
import android.text.Editable
import android.text.TextWatcher
import android.view.View
import android.widget.EditText
import android.widget.ImageButton
import android.widget.ImageView
import android.widget.TextView
import androidx.appcompat.app.AppCompatActivity
import androidx.lifecycle.ViewModelProvider
import androidx.viewpager2.widget.ViewPager2
import com.bumptech.glide.Glide
import com.google.android.material.card.MaterialCardView
import com.google.android.material.tabs.TabLayout
import com.google.android.material.tabs.TabLayoutMediator
import com.usradio.app.adapter.ViewPagerAdapter
import com.usradio.app.fragment.RadioListFragment
import com.usradio.app.model.RadioStation
import com.usradio.app.service.RadioPlayerService
import com.usradio.app.viewmodel.RadioViewModel

class MainActivity : AppCompatActivity(), RadioPlayerService.PlayerListener {
    
    private lateinit var searchEditText: EditText
    private lateinit var tabLayout: TabLayout
    private lateinit var viewPager: ViewPager2
    private lateinit var playerCard: MaterialCardView
    private lateinit var playerStationLogo: ImageView
    private lateinit var playerStationName: TextView
    private lateinit var playerStatus: TextView
    private lateinit var playPauseButton: ImageButton
    
    private lateinit var viewModel: RadioViewModel
    private lateinit var viewPagerAdapter: ViewPagerAdapter
    
    private var playerService: RadioPlayerService? = null
    private var isServiceBound = false
    
    private val serviceConnection = object : ServiceConnection {
        override fun onServiceConnected(name: ComponentName?, service: IBinder?) {
            val binder = service as RadioPlayerService.RadioPlayerBinder
            playerService = binder.getService()
            playerService?.setPlayerListener(this@MainActivity)
            isServiceBound = true
            
            // Update UI with current playing state
            val currentStation = playerService?.getCurrentStation()
            val isPlaying = playerService?.isPlaying() ?: false
            updatePlayerUI(currentStation, isPlaying)
        }
        
        override fun onServiceDisconnected(name: ComponentName?) {
            playerService = null
            isServiceBound = false
        }
    }
    
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_main)
        
        initViews()
        setupViewModel()
        setupViewPager()
        setupSearch()
        setupPlayerControls()
    }
    
    override fun onStart() {
        super.onStart()
        bindPlayerService()
    }
    
    override fun onStop() {
        super.onStop()
        if (isServiceBound) {
            unbindService(serviceConnection)
            isServiceBound = false
        }
    }
    
    private fun initViews() {
        searchEditText = findViewById(R.id.searchEditText)
        tabLayout = findViewById(R.id.tabLayout)
        viewPager = findViewById(R.id.viewPager)
        playerCard = findViewById(R.id.playerCard)
        playerStationLogo = findViewById(R.id.playerStationLogo)
        playerStationName = findViewById(R.id.playerStationName)
        playerStatus = findViewById(R.id.playerStatus)
        playPauseButton = findViewById(R.id.playPauseButton)
    }
    
    private fun setupViewModel() {
        viewModel = ViewModelProvider(this)[RadioViewModel::class.java]
        
        viewModel.currentPlayingStation.observe(this) { station ->
            if (station != null) {
                playStation(station)
            }
        }
        
        viewModel.isPlaying.observe(this) { isPlaying ->
            updatePlayPauseButton(isPlaying)
        }
    }
    
    private fun setupViewPager() {
        viewPagerAdapter = ViewPagerAdapter(this)
        viewPager.adapter = viewPagerAdapter
        
        TabLayoutMediator(tabLayout, viewPager) { tab, position ->
            tab.text = when (position) {
                0 -> getString(R.string.all_stations)
                1 -> getString(R.string.favorites)
                else -> ""
            }
        }.attach()
    }
    
    private fun setupSearch() {
        searchEditText.addTextChangedListener(object : TextWatcher {
            override fun beforeTextChanged(s: CharSequence?, start: Int, count: Int, after: Int) {}
            
            override fun onTextChanged(s: CharSequence?, start: Int, before: Int, count: Int) {}
            
            override fun afterTextChanged(s: Editable?) {
                val query = s?.toString()?.trim() ?: ""
                searchStations(query)
            }
        })
    }
    
    private fun setupPlayerControls() {
        playPauseButton.setOnClickListener {
            if (playerService?.isPlaying() == true) {
                playerService?.pausePlayback()
                viewModel.pausePlayback()
            } else {
                playerService?.resumePlayback()
                viewModel.currentPlayingStation.value?.let { station ->
                    viewModel.playStation(station)
                }
            }
        }
        
        playerCard.setOnClickListener {
            // Could expand to show full player screen
        }
    }
    
    private fun searchStations(query: String) {
        val currentFragment = getCurrentFragment()
        currentFragment?.searchStations(query)
    }
    
    private fun getCurrentFragment(): RadioListFragment? {
        val currentItem = viewPager.currentItem
        return supportFragmentManager.findFragmentByTag("f$currentItem") as? RadioListFragment
    }
    
    private fun bindPlayerService() {
        val intent = Intent(this, RadioPlayerService::class.java)
        bindService(intent, serviceConnection, Context.BIND_AUTO_CREATE)
    }
    
    private fun playStation(station: RadioStation) {
        if (!isServiceBound) {
            bindPlayerService()
        }
        
        val intent = Intent(this, RadioPlayerService::class.java).apply {
            action = RadioPlayerService.ACTION_PLAY
            putExtra(RadioPlayerService.EXTRA_STATION, station)
        }
        startService(intent)
        
        updatePlayerUI(station, true)
    }
    
    private fun updatePlayerUI(station: RadioStation?, isPlaying: Boolean) {
        if (station != null) {
            playerCard.visibility = View.VISIBLE
            playerStationName.text = station.getDisplayName()
            playerStatus.text = if (isPlaying) {
                getString(R.string.now_playing)
            } else {
                getString(R.string.pause)
            }
            
            // Load station logo
            val faviconUrl = station.getFaviconUrl()
            if (faviconUrl != null) {
                Glide.with(this)
                    .load(faviconUrl)
                    .placeholder(R.drawable.ic_radio_default)
                    .error(R.drawable.ic_radio_default)
                    .into(playerStationLogo)
            } else {
                playerStationLogo.setImageResource(R.drawable.ic_radio_default)
            }
            
            updatePlayPauseButton(isPlaying)
        } else {
            playerCard.visibility = View.GONE
        }
    }
    
    private fun updatePlayPauseButton(isPlaying: Boolean) {
        playPauseButton.setImageResource(
            if (isPlaying) R.drawable.ic_pause else R.drawable.ic_play
        )
    }
    
    override fun onPlaybackStateChanged(isPlaying: Boolean, station: RadioStation?) {
        runOnUiThread {
            updatePlayerUI(station, isPlaying)
        }
    }
    
    override fun onError(error: String) {
        runOnUiThread {
            playerStatus.text = error
            updatePlayPauseButton(false)
        }
    }
}