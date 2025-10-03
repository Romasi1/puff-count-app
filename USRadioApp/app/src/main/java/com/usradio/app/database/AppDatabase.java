package com.usradio.app.database;

import android.content.Context;
import androidx.room.Database;
import androidx.room.Room;
import androidx.room.RoomDatabase;
import com.usradio.app.model.RadioStation;

@Database(entities = {RadioStation.class}, version = 1, exportSchema = false)
public abstract class AppDatabase extends RoomDatabase {
    
    private static AppDatabase instance;
    
    public abstract FavoriteDao favoriteDao();
    
    public static synchronized AppDatabase getInstance(Context context) {
        if (instance == null) {
            instance = Room.databaseBuilder(
                context.getApplicationContext(),
                AppDatabase.class,
                "radio_database"
            ).fallbackToDestructiveMigration()
             .build();
        }
        return instance;
    }
}
