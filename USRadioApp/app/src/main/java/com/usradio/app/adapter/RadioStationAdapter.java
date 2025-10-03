package com.usradio.app.adapter;

import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.ImageButton;
import android.widget.ImageView;
import android.widget.TextView;
import androidx.annotation.NonNull;
import androidx.recyclerview.widget.RecyclerView;
import com.bumptech.glide.Glide;
import com.bumptech.glide.load.engine.DiskCacheStrategy;
import com.usradio.app.R;
import com.usradio.app.model.RadioStation;
import java.util.ArrayList;
import java.util.List;

public class RadioStationAdapter extends RecyclerView.Adapter<RadioStationAdapter.ViewHolder> {
    
    private List<RadioStation> stations = new ArrayList<>();
    private OnStationClickListener listener;
    
    public interface OnStationClickListener {
        void onStationClick(RadioStation station);
        void onFavoriteClick(RadioStation station);
    }
    
    public RadioStationAdapter(OnStationClickListener listener) {
        this.listener = listener;
    }
    
    public void setStations(List<RadioStation> stations) {
        this.stations = stations != null ? stations : new ArrayList<>();
        notifyDataSetChanged();
    }
    
    public void updateStation(RadioStation station) {
        for (int i = 0; i < stations.size(); i++) {
            if (stations.get(i).getStationUuid().equals(station.getStationUuid())) {
                stations.set(i, station);
                notifyItemChanged(i);
                break;
            }
        }
    }
    
    @NonNull
    @Override
    public ViewHolder onCreateViewHolder(@NonNull ViewGroup parent, int viewType) {
        View view = LayoutInflater.from(parent.getContext())
            .inflate(R.layout.item_radio_station, parent, false);
        return new ViewHolder(view);
    }
    
    @Override
    public void onBindViewHolder(@NonNull ViewHolder holder, int position) {
        RadioStation station = stations.get(position);
        holder.bind(station);
    }
    
    @Override
    public int getItemCount() {
        return stations.size();
    }
    
    class ViewHolder extends RecyclerView.ViewHolder {
        ImageView imgLogo;
        TextView txtName;
        TextView txtState;
        TextView txtTags;
        TextView txtBitrate;
        ImageButton btnFavorite;
        
        ViewHolder(View itemView) {
            super(itemView);
            imgLogo = itemView.findViewById(R.id.imgStationLogo);
            txtName = itemView.findViewById(R.id.txtStationName);
            txtState = itemView.findViewById(R.id.txtStationState);
            txtTags = itemView.findViewById(R.id.txtStationTags);
            txtBitrate = itemView.findViewById(R.id.txtStationBitrate);
            btnFavorite = itemView.findViewById(R.id.btnFavorite);
        }
        
        void bind(RadioStation station) {
            txtName.setText(station.getName() != null ? station.getName() : "Unknown Station");
            
            String stateInfo = station.getState() != null && !station.getState().isEmpty() 
                ? station.getState() 
                : "USA";
            txtState.setText(stateInfo);
            
            String tags = station.getTags() != null && !station.getTags().isEmpty() 
                ? station.getTags() 
                : "No tags";
            txtTags.setText(tags);
            
            String bitrateInfo = station.getBitrate() > 0 
                ? station.getBitrate() + " kbps" 
                : "Unknown bitrate";
            if (station.getCodec() != null && !station.getCodec().isEmpty()) {
                bitrateInfo += " • " + station.getCodec().toUpperCase();
            }
            txtBitrate.setText(bitrateInfo);
            
            // Load favicon/logo
            if (station.getFavicon() != null && !station.getFavicon().isEmpty()) {
                Glide.with(itemView.getContext())
                    .load(station.getFavicon())
                    .diskCacheStrategy(DiskCacheStrategy.ALL)
                    .placeholder(android.R.drawable.ic_btn_speak_now)
                    .error(android.R.drawable.ic_btn_speak_now)
                    .into(imgLogo);
            } else {
                imgLogo.setImageResource(android.R.drawable.ic_btn_speak_now);
            }
            
            // Set favorite icon
            if (station.isFavorite()) {
                btnFavorite.setImageResource(android.R.drawable.btn_star_big_on);
            } else {
                btnFavorite.setImageResource(android.R.drawable.btn_star_big_off);
            }
            
            // Click listeners
            itemView.setOnClickListener(v -> {
                if (listener != null) {
                    listener.onStationClick(station);
                }
            });
            
            btnFavorite.setOnClickListener(v -> {
                if (listener != null) {
                    listener.onFavoriteClick(station);
                }
            });
        }
    }
}
