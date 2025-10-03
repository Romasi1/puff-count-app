package com.usradio.app.player;

import android.content.Context;
import com.google.android.exoplayer2.ExoPlayer;
import com.google.android.exoplayer2.MediaItem;
import com.google.android.exoplayer2.PlaybackException;
import com.google.android.exoplayer2.Player;
import com.google.android.exoplayer2.source.MediaSource;
import com.google.android.exoplayer2.source.ProgressiveMediaSource;
import com.google.android.exoplayer2.upstream.DefaultHttpDataSource;
import com.usradio.app.model.RadioStation;

public class RadioPlayer {
    
    private ExoPlayer player;
    private RadioStation currentStation;
    private PlayerStateListener stateListener;
    
    public interface PlayerStateListener {
        void onPlayerReady();
        void onPlayerError(String error);
        void onPlaybackStateChanged(boolean isPlaying);
    }
    
    public RadioPlayer(Context context) {
        player = new ExoPlayer.Builder(context).build();
        
        player.addListener(new Player.Listener() {
            @Override
            public void onPlaybackStateChanged(int playbackState) {
                if (stateListener != null) {
                    switch (playbackState) {
                        case Player.STATE_READY:
                            stateListener.onPlayerReady();
                            break;
                        case Player.STATE_ENDED:
                            stateListener.onPlaybackStateChanged(false);
                            break;
                    }
                }
            }
            
            @Override
            public void onIsPlayingChanged(boolean isPlaying) {
                if (stateListener != null) {
                    stateListener.onPlaybackStateChanged(isPlaying);
                }
            }
            
            @Override
            public void onPlayerError(PlaybackException error) {
                if (stateListener != null) {
                    stateListener.onPlayerError(error.getMessage());
                }
            }
        });
    }
    
    public void setPlayerStateListener(PlayerStateListener listener) {
        this.stateListener = listener;
    }
    
    public void playStation(RadioStation station) {
        if (station == null || station.getStreamUrl() == null) {
            if (stateListener != null) {
                stateListener.onPlayerError("Invalid station URL");
            }
            return;
        }
        
        currentStation = station;
        
        DefaultHttpDataSource.Factory dataSourceFactory = new DefaultHttpDataSource.Factory()
            .setUserAgent("USRadioApp/1.0")
            .setConnectTimeoutMs(10000)
            .setReadTimeoutMs(10000);
        
        MediaItem mediaItem = MediaItem.fromUri(station.getStreamUrl());
        MediaSource mediaSource = new ProgressiveMediaSource.Factory(dataSourceFactory)
            .createMediaSource(mediaItem);
        
        player.setMediaSource(mediaSource);
        player.prepare();
        player.setPlayWhenReady(true);
    }
    
    public void play() {
        player.setPlayWhenReady(true);
    }
    
    public void pause() {
        player.setPlayWhenReady(false);
    }
    
    public void stop() {
        player.stop();
        currentStation = null;
    }
    
    public boolean isPlaying() {
        return player.isPlaying();
    }
    
    public RadioStation getCurrentStation() {
        return currentStation;
    }
    
    public void release() {
        if (player != null) {
            player.release();
            player = null;
        }
    }
}
