package com.usradio.app.fragment

import android.os.Bundle
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import androidx.fragment.app.Fragment
import androidx.lifecycle.ViewModelProvider
import androidx.recyclerview.widget.LinearLayoutManager
import androidx.recyclerview.widget.RecyclerView
import androidx.swiperefreshlayout.widget.SwipeRefreshLayout
import com.usradio.app.R
import com.usradio.app.adapter.RadioStationAdapter
import com.usradio.app.model.RadioStation
import com.usradio.app.viewmodel.RadioViewModel
import android.widget.Button
import android.widget.LinearLayout
import android.widget.ProgressBar
import android.widget.TextView

class RadioListFragment : Fragment() {
    
    companion object {
        private const val ARG_IS_FAVORITES = "is_favorites"
        
        fun newInstance(isFavorites: Boolean): RadioListFragment {
            val fragment = RadioListFragment()
            val args = Bundle()
            args.putBoolean(ARG_IS_FAVORITES, isFavorites)
            fragment.arguments = args
            return fragment
        }
    }
    
    private lateinit var recyclerView: RecyclerView
    private lateinit var swipeRefreshLayout: SwipeRefreshLayout
    private lateinit var progressBar: ProgressBar
    private lateinit var emptyStateLayout: LinearLayout
    private lateinit var emptyStateText: TextView
    private lateinit var retryButton: Button
    
    private lateinit var adapter: RadioStationAdapter
    private lateinit var viewModel: RadioViewModel
    
    private val isFavorites: Boolean by lazy {
        arguments?.getBoolean(ARG_IS_FAVORITES, false) ?: false
    }
    
    override fun onCreateView(
        inflater: LayoutInflater,
        container: ViewGroup?,
        savedInstanceState: Bundle?
    ): View? {
        return inflater.inflate(R.layout.fragment_radio_list, container, false)
    }
    
    override fun onViewCreated(view: View, savedInstanceState: Bundle?) {
        super.onViewCreated(view, savedInstanceState)
        
        initViews(view)
        setupRecyclerView()
        setupViewModel()
        setupSwipeRefresh()
        
        if (!isFavorites) {
            viewModel.loadStations()
        }
    }
    
    private fun initViews(view: View) {
        recyclerView = view.findViewById(R.id.recyclerView)
        swipeRefreshLayout = view.findViewById(R.id.swipeRefreshLayout)
        progressBar = view.findViewById(R.id.progressBar)
        emptyStateLayout = view.findViewById(R.id.emptyStateLayout)
        emptyStateText = view.findViewById(R.id.emptyStateText)
        retryButton = view.findViewById(R.id.retryButton)
    }
    
    private fun setupRecyclerView() {
        adapter = RadioStationAdapter(
            onPlayClick = { station ->
                viewModel.playStation(station)
            },
            onFavoriteClick = { station ->
                viewModel.toggleFavorite(station)
            }
        )
        
        recyclerView.layoutManager = LinearLayoutManager(context)
        recyclerView.adapter = adapter
    }
    
    private fun setupViewModel() {
        viewModel = ViewModelProvider(requireActivity())[RadioViewModel::class.java]
        
        if (isFavorites) {
            viewModel.favoriteStations.observe(viewLifecycleOwner) { stations ->
                updateUI(stations, false)
            }
        } else {
            viewModel.stations.observe(viewLifecycleOwner) { stations ->
                updateUI(stations, false)
            }
            
            viewModel.isLoading.observe(viewLifecycleOwner) { isLoading ->
                progressBar.visibility = if (isLoading && adapter.itemCount == 0) View.VISIBLE else View.GONE
                swipeRefreshLayout.isRefreshing = isLoading && adapter.itemCount > 0
            }
            
            viewModel.error.observe(viewLifecycleOwner) { error ->
                if (error != null) {
                    showError(error)
                }
            }
        }
        
        viewModel.filteredStations.observe(viewLifecycleOwner) { stations ->
            if (stations != null) {
                updateUI(stations, true)
            }
        }
    }
    
    private fun setupSwipeRefresh() {
        swipeRefreshLayout.setOnRefreshListener {
            if (!isFavorites) {
                viewModel.loadStations()
            } else {
                swipeRefreshLayout.isRefreshing = false
            }
        }
        
        retryButton.setOnClickListener {
            if (!isFavorites) {
                viewModel.loadStations()
            }
        }
    }
    
    private fun updateUI(stations: List<RadioStation>, isFiltered: Boolean) {
        adapter.submitList(stations)
        
        val isEmpty = stations.isEmpty()
        recyclerView.visibility = if (isEmpty) View.GONE else View.VISIBLE
        emptyStateLayout.visibility = if (isEmpty) View.VISIBLE else View.GONE
        
        if (isEmpty) {
            emptyStateText.text = if (isFavorites) {
                getString(R.string.no_favorites)
            } else if (isFiltered) {
                getString(R.string.no_stations)
            } else {
                getString(R.string.no_stations)
            }
            retryButton.visibility = if (!isFavorites && !isFiltered) View.VISIBLE else View.GONE
        }
    }
    
    private fun showError(error: String) {
        emptyStateLayout.visibility = View.VISIBLE
        recyclerView.visibility = View.GONE
        emptyStateText.text = error
        retryButton.visibility = View.VISIBLE
    }
    
    fun searchStations(query: String) {
        if (isFavorites) {
            viewModel.filterFavorites(query)
        } else {
            viewModel.filterStations(query)
        }
    }
}