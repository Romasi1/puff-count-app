package com.usradio.app.adapter

import androidx.fragment.app.Fragment
import androidx.fragment.app.FragmentActivity
import androidx.viewpager2.adapter.FragmentStateAdapter
import com.usradio.app.fragment.RadioListFragment

class ViewPagerAdapter(fragmentActivity: FragmentActivity) : FragmentStateAdapter(fragmentActivity) {
    
    override fun getItemCount(): Int = 2
    
    override fun createFragment(position: Int): Fragment {
        return when (position) {
            0 -> RadioListFragment.newInstance(isFavorites = false) // All stations
            1 -> RadioListFragment.newInstance(isFavorites = true)  // Favorites
            else -> throw IllegalArgumentException("Invalid position: $position")
        }
    }
}