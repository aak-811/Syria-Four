package com.syriafour.admin.ui.dashboard

import androidx.lifecycle.ViewModel
import androidx.lifecycle.ViewModelProvider
import androidx.lifecycle.viewModelScope
import com.syriafour.admin.data.repository.AdminRepository
import com.syriafour.admin.data.repository.AuthRepository
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.launch

data class DashboardUiState(
    val userName: String = "",
    val userRole: String = "",
    val userEmail: String = "",
    val userCount: Int = 0,
    val memberCount: Int = 0,
    val orderCount: Int = 0,
    val ticketCount: Int = 0,
    val isLoading: Boolean = false,
    val error: String? = null
)

class DashboardViewModel(
    private val adminRepo: AdminRepository,
    private val authRepo: AuthRepository
) : ViewModel() {

    private val _uiState = MutableStateFlow(DashboardUiState())
    val uiState: StateFlow<DashboardUiState> = _uiState

    init {
        loadDashboard()
    }

    fun loadDashboard() {
        viewModelScope.launch {
            _uiState.value = _uiState.value.copy(isLoading = true, error = null)
            try {
                val usersResult = adminRepo.getUsers()
                val membersResult = adminRepo.getMembers()
                val ordersResult = adminRepo.getOrders()
                val ticketsResult = adminRepo.getSupportTickets()

                _uiState.value = _uiState.value.copy(
                    userName = authRepo.session.userName ?: "",
                    userRole = authRepo.session.userRole ?: "",
                    userEmail = authRepo.session.userEmail ?: "",
                    userCount = usersResult.getOrNull()?.size ?: 0,
                    memberCount = membersResult.getOrNull()?.size ?: 0,
                    orderCount = ordersResult.getOrNull()?.size ?: 0,
                    ticketCount = ticketsResult.getOrNull()?.size ?: 0,
                    isLoading = false
                )
            } catch (e: Exception) {
                _uiState.value = _uiState.value.copy(
                    isLoading = false,
                    error = e.message
                )
            }
        }
    }

    fun logout() {
        authRepo.logout()
    }

    class Factory(
        private val adminRepo: AdminRepository,
        private val authRepo: AuthRepository
    ) : ViewModelProvider.Factory {
        @Suppress("UNCHECKED_CAST")
        override fun <T : ViewModel> create(modelClass: Class<T>): T =
            DashboardViewModel(adminRepo, authRepo) as T
    }
}
