package com.syriafour.admin.ui.notifications

import androidx.lifecycle.ViewModel
import androidx.lifecycle.ViewModelProvider
import androidx.lifecycle.viewModelScope
import com.syriafour.admin.data.model.NotificationItem
import com.syriafour.admin.data.repository.AdminRepository
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.launch

data class NotificationsUiState(
    val notifications: List<NotificationItem> = emptyList(),
    val isLoading: Boolean = false,
    val error: String? = null,
    val showDeleteDialog: NotificationItem? = null,
    val editingNotification: NotificationItem? = null,
    val showCreateDialog: Boolean = false,
    val message: String? = null
)

class NotificationsViewModel(private val adminRepo: AdminRepository) : ViewModel() {

    private val _uiState = MutableStateFlow(NotificationsUiState())
    val uiState: StateFlow<NotificationsUiState> = _uiState

    init { load() }

    fun load() {
        viewModelScope.launch {
            _uiState.value = _uiState.value.copy(isLoading = true, error = null)
            adminRepo.getNotifications().fold(
                onSuccess = { _uiState.value = _uiState.value.copy(notifications = it, isLoading = false) },
                onFailure = { _uiState.value = _uiState.value.copy(error = it.message, isLoading = false) }
            )
        }
    }

    fun showDelete(n: NotificationItem) { _uiState.value = _uiState.value.copy(showDeleteDialog = n) }
    fun dismissDelete() { _uiState.value = _uiState.value.copy(showDeleteDialog = null) }

    fun delete(n: NotificationItem) {
        viewModelScope.launch {
            adminRepo.deleteNotification(n.id).fold(
                onSuccess = {
                    _uiState.value = _uiState.value.copy(showDeleteDialog = null, message = "تم حذف الإشعار")
                    load()
                },
                onFailure = { _uiState.value = _uiState.value.copy(error = it.message) }
            )
        }
    }

    fun showCreate() { _uiState.value = _uiState.value.copy(showCreateDialog = true) }
    fun dismissCreate() { _uiState.value = _uiState.value.copy(showCreateDialog = false) }

    fun create(data: Map<String, String>) {
        viewModelScope.launch {
            adminRepo.createNotification(data).fold(
                onSuccess = {
                    _uiState.value = _uiState.value.copy(showCreateDialog = false, message = "تم إنشاء الإشعار")
                    load()
                },
                onFailure = { _uiState.value = _uiState.value.copy(error = it.message) }
            )
        }
    }

    fun showEdit(n: NotificationItem) { _uiState.value = _uiState.value.copy(editingNotification = n) }
    fun dismissEdit() { _uiState.value = _uiState.value.copy(editingNotification = null) }

    fun edit(n: NotificationItem, data: Map<String, String>) {
        viewModelScope.launch {
            adminRepo.updateNotification(n.id, data).fold(
                onSuccess = {
                    _uiState.value = _uiState.value.copy(editingNotification = null, message = "تم تحديث الإشعار")
                    load()
                },
                onFailure = { _uiState.value = _uiState.value.copy(error = it.message) }
            )
        }
    }

    fun clearMessage() { _uiState.value = _uiState.value.copy(message = null) }

    class Factory(private val adminRepo: AdminRepository) : ViewModelProvider.Factory {
        @Suppress("UNCHECKED_CAST")
        override fun <T : ViewModel> create(modelClass: Class<T>): T = NotificationsViewModel(adminRepo) as T
    }
}
