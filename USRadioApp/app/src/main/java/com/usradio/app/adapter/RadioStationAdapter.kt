package com.usradio.app.adapter

import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.ImageButton
import android.widget.ImageView
import android.widget.TextView
import androidx.recyclerview.widget.DiffUtil
import androidx.recyclerview.widget.ListAdapter
import androidx.recyclerview.widget.RecyclerView
import com.bumptech.glide.Glide
import com.bumptech.glide.load.engine.DiskCacheStrategy
import com.usradio.app.R
import com.usradio.app.model.RadioStation

class RadioStationAdapter(
    private val onPlayClick: (RadioStation) -> Unit,
    private val onFavoriteClick: (RadioStation) -> Unit
) : ListAdapter<RadioStation, RadioStationAdapter.ViewHolder>(DiffCallback()) {

    override fun onCreateViewHolder(parent: ViewGroup, viewType: Int): ViewHolder {
        val view = LayoutInflater.from(parent.context)
            .inflate(R.layout.item_radio_station, parent, false)
        return ViewHolder(view)
    }

    override fun onBindViewHolder(holder: ViewHolder, position: Int) {
        holder.bind(getItem(position))
    }

    inner class ViewHolder(itemView: View) : RecyclerView.ViewHolder(itemView) {
        private val stationLogo: ImageView = itemView.findViewById(R.id.stationLogo)
        private val stationName: TextView = itemView.findViewById(R.id.stationName)
        private val stationCountry: TextView = itemView.findViewById(R.id.stationCountry)
        private val stationTags: TextView = itemView.findViewById(R.id.stationTags)
        private val favoriteButton: ImageButton = itemView.findViewById(R.id.favoriteButton)
        private val playButton: ImageButton = itemView.findViewById(R.id.playButton)

        fun bind(station: RadioStation) {
            stationName.text = station.getDisplayName()
            stationCountry.text = station.getDisplayCountry()
            stationTags.text = station.getDisplayTags()

            // Load station logo
            val faviconUrl = station.getFaviconUrl()
            if (faviconUrl != null) {
                Glide.with(itemView.context)
                    .load(faviconUrl)
                    .diskCacheStrategy(DiskCacheStrategy.ALL)
                    .placeholder(R.drawable.ic_radio_default)
                    .error(R.drawable.ic_radio_default)
                    .into(stationLogo)
            } else {
                stationLogo.setImageResource(R.drawable.ic_radio_default)
            }

            // Set favorite button state
            favoriteButton.setImageResource(
                if (station.isFavorite) R.drawable.ic_favorite else R.drawable.ic_favorite_border
            )

            // Set click listeners
            playButton.setOnClickListener { onPlayClick(station) }
            favoriteButton.setOnClickListener { onFavoriteClick(station) }
            
            itemView.setOnClickListener { onPlayClick(station) }
        }
    }

    private class DiffCallback : DiffUtil.ItemCallback<RadioStation>() {
        override fun areItemsTheSame(oldItem: RadioStation, newItem: RadioStation): Boolean {
            return oldItem.stationUuid == newItem.stationUuid
        }

        override fun areContentsTheSame(oldItem: RadioStation, newItem: RadioStation): Boolean {
            return oldItem == newItem
        }
    }
}