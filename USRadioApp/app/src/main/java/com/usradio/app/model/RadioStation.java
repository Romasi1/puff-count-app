package com.usradio.app.model;

import androidx.room.Entity;
import androidx.room.PrimaryKey;
import com.google.gson.annotations.SerializedName;

@Entity(tableName = "favorite_stations")
public class RadioStation {
    
    @PrimaryKey
    @SerializedName("stationuuid")
    private String stationUuid;
    
    @SerializedName("name")
    private String name;
    
    @SerializedName("url")
    private String url;
    
    @SerializedName("url_resolved")
    private String urlResolved;
    
    @SerializedName("homepage")
    private String homepage;
    
    @SerializedName("favicon")
    private String favicon;
    
    @SerializedName("tags")
    private String tags;
    
    @SerializedName("country")
    private String country;
    
    @SerializedName("state")
    private String state;
    
    @SerializedName("language")
    private String language;
    
    @SerializedName("votes")
    private int votes;
    
    @SerializedName("codec")
    private String codec;
    
    @SerializedName("bitrate")
    private int bitrate;
    
    private boolean isFavorite;
    
    public RadioStation() {}
    
    // Getters
    public String getStationUuid() { return stationUuid; }
    public String getName() { return name; }
    public String getUrl() { return url; }
    public String getUrlResolved() { return urlResolved; }
    public String getHomepage() { return homepage; }
    public String getFavicon() { return favicon; }
    public String getTags() { return tags; }
    public String getCountry() { return country; }
    public String getState() { return state; }
    public String getLanguage() { return language; }
    public int getVotes() { return votes; }
    public String getCodec() { return codec; }
    public int getBitrate() { return bitrate; }
    public boolean isFavorite() { return isFavorite; }
    
    // Setters
    public void setStationUuid(String stationUuid) { this.stationUuid = stationUuid; }
    public void setName(String name) { this.name = name; }
    public void setUrl(String url) { this.url = url; }
    public void setUrlResolved(String urlResolved) { this.urlResolved = urlResolved; }
    public void setHomepage(String homepage) { this.homepage = homepage; }
    public void setFavicon(String favicon) { this.favicon = favicon; }
    public void setTags(String tags) { this.tags = tags; }
    public void setCountry(String country) { this.country = country; }
    public void setState(String state) { this.state = state; }
    public void setLanguage(String language) { this.language = language; }
    public void setVotes(int votes) { this.votes = votes; }
    public void setCodec(String codec) { this.codec = codec; }
    public void setBitrate(int bitrate) { this.bitrate = bitrate; }
    public void setFavorite(boolean favorite) { isFavorite = favorite; }
    
    public String getStreamUrl() {
        return urlResolved != null && !urlResolved.isEmpty() ? urlResolved : url;
    }
}
