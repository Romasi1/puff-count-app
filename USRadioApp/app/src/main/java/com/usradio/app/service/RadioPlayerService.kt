package com.usradio.app.service

import android.app.Notification
import android.app.NotificationChannel
import android.app.NotificationManager
import android.app.PendingIntent
import android.app.Service
import android.content.Context
import android.content.Intent
import android.os.Binder
import android.os.Build
import android.os.IBinder
import androidx.core.app.NotificationCompat
import androidx.media3.common.MediaItem
import androidx.media3.common.Player
import androidx.media3.exoplayer.ExoPlayer
import com.usradio.app.MainActivity
import com.usradio.app.R
import com.usradio.app.model.RadioStation

class RadioPlayerService : Service() {
    
    companion object {
        private const val NOTIFICATION_ID = 1
        private const val CHANNEL_ID = "radio_player_channel"
        const val ACTION_PLAY = "ACTION_PLAY"
        const val ACTION_PAUSE = "ACTION_PAUSE"
        const val ACTION_STOP = "ACTION_STOP"
        const val EXTRA_STATION = "EXTRA_STATION"
    }
    
    private val binder = RadioPlayerBinder()
    private lateinit var player: ExoPlayer
    private var currentStation: RadioStation? = null
    private var playerListener: PlayerListener? = null
    
    interface PlayerListener {
        fun onPlaybackStateChanged(isPlaying: Boolean, station: RadioStation?)
        fun onError(error: String)
    }
    
    inner class RadioPlayerBinder : Binder() {
        fun getService(): RadioPlayerService = this@RadioPlayerService
    }
    
    override fun onCreate() {
        super.onCreate()
        initializePlayer()
        createNotificationChannel()
    }
    
    override fun onBind(intent: Intent?): IBinder = binder
    
    override fun onStartCommand(intent: Intent?, flags: Int, startId: Int): Int {
        when (intent?.action) {
            ACTION_PLAY -> {
                val station = if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.TIRAMISU) {
                    intent.getParcelableExtra(EXTRA_STATION, RadioStation::class.java)
                } else {
                    @Suppress("DEPRECATION")
                    intent.getParcelableExtra(EXTRA_STATION)
                }
                station?.let { playStation(it) }
            }
            ACTION_PAUSE -> pausePlayback()
            ACTION_STOP -> stopPlayback()
        }
        return START_NOT_STICKY
    }
    
    override fun onDestroy() {
        super.onDestroy()
        player.release()
    }
    
    private fun initializePlayer() {
        player = ExoPlayer.Builder(this).build()
        
        player.addListener(object : Player.Listener {
            override fun onPlaybackStateChanged(playbackState: Int) {
                val isPlaying = playbackState == Player.STATE_READY && player.playWhenReady
                playerListener?.onPlaybackStateChanged(isPlaying, currentStation)
                
                if (isPlaying) {
                    startForeground(NOTIFICATION_ID, createNotification())
                } else if (playbackState == Player.STATE_ENDED || playbackState == Player.STATE_IDLE) {
                    stopForeground(true)
                }
            }
            
            override fun onPlayerError(error: androidx.media3.common.PlaybackException) {
                playerListener?.onError("Error playing radio: ${error.message}")
                stopForeground(true)
            }
        })
    }
    
    private fun createNotificationChannel() {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            val channel = NotificationChannel(
                CHANNEL_ID,
                "Radio Player",
                NotificationManager.IMPORTANCE_LOW
            ).apply {
                description = "Controls for radio playback"
                setShowBadge(false)
            }
            
            val notificationManager = getSystemService(Context.NOTIFICATION_SERVICE) as NotificationManager
            notificationManager.createNotificationChannel(channel)
        }
    }
    
    private fun createNotification(): Notification {
        val intent = Intent(this, MainActivity::class.java)
        val pendingIntent = PendingIntent.getActivity(
            this, 0, intent,
            PendingIntent.FLAG_UPDATE_CURRENT or PendingIntent.FLAG_IMMUTABLE
        )
        
        val playPauseAction = if (player.isPlaying) {
            NotificationCompat.Action(
                R.drawable.ic_pause,
                "Pause",
                PendingIntent.getService(
                    this, 0,
                    Intent(this, RadioPlayerService::class.java).setAction(ACTION_PAUSE),
                    PendingIntent.FLAG_UPDATE_CURRENT or PendingIntent.FLAG_IMMUTABLE
                )
            )
        } else {
            NotificationCompat.Action(
                R.drawable.ic_play,
                "Play",
                PendingIntent.getService(
                    this, 0,
                    Intent(this, RadioPlayerService::class.java).setAction(ACTION_PLAY),
                    PendingIntent.FLAG_UPDATE_CURRENT or PendingIntent.FLAG_IMMUTABLE
                )
            )
        }
        
        val stopAction = NotificationCompat.Action(
            R.drawable.ic_pause, // Using pause icon as stop
            "Stop",
            PendingIntent.getService(
                this, 0,
                Intent(this, RadioPlayerService::class.java).setAction(ACTION_STOP),
                PendingIntent.FLAG_UPDATE_CURRENT or PendingIntent.FLAG_IMMUTABLE
            )
        )
        
        return NotificationCompat.Builder(this, CHANNEL_ID)
            .setContentTitle(currentStation?.getDisplayName() ?: "US Radio")
            .setContentText("Playing radio station")
            .setSmallIcon(R.drawable.ic_radio_default)
            .setContentIntent(pendingIntent)
            .addAction(playPauseAction)
            .addAction(stopAction)
            .setOngoing(true)
            .setVisibility(NotificationCompat.VISIBILITY_PUBLIC)
            .build()
    }
    
    fun playStation(station: RadioStation) {
        currentStation = station
        val mediaItem = MediaItem.fromUri(station.getStreamUrl())
        player.setMediaItem(mediaItem)
        player.prepare()
        player.play()
    }
    
    fun pausePlayback() {
        player.pause()
    }
    
    fun resumePlayback() {
        player.play()
    }
    
    fun stopPlayback() {
        player.stop()
        currentStation = null
        stopForeground(true)
        stopSelf()
    }
    
    fun isPlaying(): Boolean = player.isPlaying
    
    fun getCurrentStation(): RadioStation? = currentStation
    
    fun setPlayerListener(listener: PlayerListener?) {
        this.playerListener = listener
    }
}