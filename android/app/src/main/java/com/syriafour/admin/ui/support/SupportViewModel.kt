package com.syriafour.admin.ui.support

import androidx.lifecycle.ViewModel
import androidx.lifecycle.ViewModelProvider
import androidx.lifecycle.viewModelScope
import com.syriafour.admin.data.model.SupportTicket
import com.syriafour.admin.data.repository.AdminRepository
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.launch

data class SupportUiState(
    val tickets: List<SupportTicket> = emptyList(),
    val isLoading: Boolean = false,
    val error: String? = null,
    val showDeleteDialog: SupportTicket? = null,
    val message: String? = null
)

class SupportViewModel(private val adminRepo: AdminRepository) : ViewModel() {

    private val _uiState = MutableStateFlow(SupportUiState())
    val uiState: StateFlow<SupportUiState> = _uiState

    init { load() }

    fun load() {
        viewModelScope.launch {
            _uiState.value = _uiState.value.copy(isLoading = true, error = null)
            adminRepo.getSupportTickets().fold(
                onSuccess = { _uiState.value = _uiState.value.copy(tickets = it, isLoading = false) },
                onFailure = { _uiState.value = _uiState.value.copy(error = it.message, isLoading = false) }
            )
        }
    }

    fun updateStatus(ticket: SupportTicket, status: String) {
        viewModelScope.launch {
            adminRepo.updateSupportStatus(ticket.id, status).fold(
                onSuccess = { _uiState.value = _uiState.value.copy(message = "تم تحديث التذكرة") },
                onFailure = { _uiState.value = _uiState.value.copy(error = it.message) }
            )
            load()
        }
    }

    fun showDelete(ticket: SupportTicket) { _uiState.value = _uiState.value.copy(showDeleteDialog = ticket) }
    fun dismissDelete() { _uiState.value = _uiState.value.copy(showDeleteDialog = null) }

    fun delete(ticket: SupportTicket) {
        viewModelScope.launch {
            adminRepo.deleteSupportTicket(ticket.id).fold(
                onSuccess = { _uiState.value = _uiState.value.copy(showDeleteDialog = null, message = "تم حذف التذكرة") },
                onFailure = { _uiState.value = _uiState.value.copy(error = it.message) }
            )
            load()
        }
    }

    fun clearMessage() { _uiState.value = _uiState.value.copy(message = null) }

    class Factory(private val adminRepo: AdminRepository) : ViewModelProvider.Factory {
        @Suppress("UNCHECKED_CAST")
        override fun <T : ViewModel> create(modelClass: Class<T>): T = SupportViewModel(adminRepo) as T
    }
}
