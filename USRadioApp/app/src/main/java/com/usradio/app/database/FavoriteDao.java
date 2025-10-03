package com.usradio.app.database;

import androidx.lifecycle.LiveData;
import androidx.room.Dao;
import androidx.room.Delete;
import androidx.room.Insert;
import androidx.room.OnConflictStrategy;
import androidx.room.Query;
import com.usradio.app.model.RadioStation;
import java.util.List;

@Dao
public interface FavoriteDao {
    
    @Insert(onConflict = OnConflictStrategy.REPLACE)
    void insertFavorite(RadioStation station);
    
    @Delete
    void deleteFavorite(RadioStation station);
    
    @Query("SELECT * FROM favorite_stations ORDER BY name ASC")
    LiveData<List<RadioStation>> getAllFavorites();
    
    @Query("SELECT * FROM favorite_stations ORDER BY name ASC")
    List<RadioStation> getAllFavoritesSync();
    
    @Query("SELECT EXISTS(SELECT 1 FROM favorite_stations WHERE stationUuid = :stationUuid)")
    boolean isFavorite(String stationUuid);
    
    @Query("DELETE FROM favorite_stations WHERE stationUuid = :stationUuid")
    void deleteFavoriteById(String stationUuid);
}
