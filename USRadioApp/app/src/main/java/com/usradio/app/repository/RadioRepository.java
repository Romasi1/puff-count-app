package com.usradio.app.repository;

import android.content.Context;
import androidx.lifecycle.LiveData;
import com.usradio.app.api.RetrofitClient;
import com.usradio.app.database.AppDatabase;
import com.usradio.app.database.FavoriteDao;
import com.usradio.app.model.RadioStation;
import java.util.List;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;

public class RadioRepository {
    
    private final FavoriteDao favoriteDao;
    private final LiveData<List<RadioStation>> allFavorites;
    private final ExecutorService executorService;
    
    public RadioRepository(Context context) {
        AppDatabase database = AppDatabase.getInstance(context);
        favoriteDao = database.favoriteDao();
        allFavorites = favoriteDao.getAllFavorites();
        executorService = Executors.newSingleThreadExecutor();
    }
    
    public LiveData<List<RadioStation>> getAllFavorites() {
        return allFavorites;
    }
    
    public void insertFavorite(RadioStation station) {
        executorService.execute(() -> favoriteDao.insertFavorite(station));
    }
    
    public void deleteFavorite(RadioStation station) {
        executorService.execute(() -> favoriteDao.deleteFavorite(station));
    }
    
    public void deleteFavoriteById(String stationUuid) {
        executorService.execute(() -> favoriteDao.deleteFavoriteById(stationUuid));
    }
    
    public boolean isFavorite(String stationUuid) {
        try {
            return favoriteDao.isFavorite(stationUuid);
        } catch (Exception e) {
            return false;
        }
    }
    
    public void checkFavoriteStatus(RadioStation station, FavoriteCheckCallback callback) {
        executorService.execute(() -> {
            boolean isFav = favoriteDao.isFavorite(station.getStationUuid());
            callback.onResult(isFav);
        });
    }
    
    public interface FavoriteCheckCallback {
        void onResult(boolean isFavorite);
    }
}
