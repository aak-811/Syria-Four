package com.syriafour.admin.ui.logs

import androidx.lifecycle.ViewModel
import androidx.lifecycle.ViewModelProvider
import androidx.lifecycle.viewModelScope
import com.syriafour.admin.data.model.AuditLog
import com.syriafour.admin.data.repository.AdminRepository
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.launch

data class AuditLogsUiState(
    val logs: List<AuditLog> = emptyList(),
    val isLoading: Boolean = false,
    val error: String? = null
)

class AuditLogsViewModel(private val adminRepo: AdminRepository) : ViewModel() {

    private val _uiState = MutableStateFlow(AuditLogsUiState())
    val uiState: StateFlow<AuditLogsUiState> = _uiState

    init { load() }

    fun load() {
        viewModelScope.launch {
            _uiState.value = _uiState.value.copy(isLoading = true, error = null)
            adminRepo.getAuditLogs().fold(
                onSuccess = { _uiState.value = _uiState.value.copy(logs = it, isLoading = false) },
                onFailure = { _uiState.value = _uiState.value.copy(error = it.message, isLoading = false) }
            )
        }
    }

    class Factory(private val adminRepo: AdminRepository) : ViewModelProvider.Factory {
        @Suppress("UNCHECKED_CAST")
        override fun <T : ViewModel> create(modelClass: Class<T>): T = AuditLogsViewModel(adminRepo) as T
    }
}
