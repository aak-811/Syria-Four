package com.syriafour.admin.ui.users

import androidx.lifecycle.ViewModel
import androidx.lifecycle.ViewModelProvider
import androidx.lifecycle.viewModelScope
import com.syriafour.admin.data.model.User
import com.syriafour.admin.data.model.UserUpdateRequest
import com.syriafour.admin.data.repository.AdminRepository
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.launch

data class UsersUiState(
    val users: List<User> = emptyList(),
    val isLoading: Boolean = false,
    val error: String? = null,
    val showDeleteDialog: User? = null,
    val showRoleDialog: User? = null,
    val showPasswordDialog: User? = null,
    val message: String? = null
)

class UsersViewModel(private val adminRepo: AdminRepository) : ViewModel() {

    private val _uiState = MutableStateFlow(UsersUiState())
    val uiState: StateFlow<UsersUiState> = _uiState

    init { loadUsers() }

    fun loadUsers() {
        viewModelScope.launch {
            _uiState.value = _uiState.value.copy(isLoading = true, error = null)
            adminRepo.getUsers().fold(
                onSuccess = { _uiState.value = _uiState.value.copy(users = it, isLoading = false) },
                onFailure = { _uiState.value = _uiState.value.copy(error = it.message, isLoading = false) }
            )
        }
    }

    fun showDeleteDialog(user: User) {
        _uiState.value = _uiState.value.copy(showDeleteDialog = user)
    }

    fun dismissDeleteDialog() {
        _uiState.value = _uiState.value.copy(showDeleteDialog = null)
    }

    fun deleteUser(user: User) {
        viewModelScope.launch {
            adminRepo.deleteUser(user.id).fold(
                onSuccess = {
                    _uiState.value = _uiState.value.copy(
                        showDeleteDialog = null,
                        message = "تم حذف المستخدم ${user.name}"
                    )
                    loadUsers()
                },
                onFailure = { _uiState.value = _uiState.value.copy(error = it.message) }
            )
        }
    }

    fun showRoleDialog(user: User) {
        _uiState.value = _uiState.value.copy(showRoleDialog = user)
    }

    fun dismissRoleDialog() {
        _uiState.value = _uiState.value.copy(showRoleDialog = null)
    }

    fun updateRole(user: User, newRole: String) {
        viewModelScope.launch {
            adminRepo.updateUser(user.id, UserUpdateRequest(role = newRole)).fold(
                onSuccess = {
                    _uiState.value = _uiState.value.copy(
                        showRoleDialog = null,
                        message = "تم تحديث دور ${user.name} إلى $newRole"
                    )
                    loadUsers()
                },
                onFailure = { _uiState.value = _uiState.value.copy(error = it.message) }
            )
        }
    }

    fun showPasswordDialog(user: User) {
        _uiState.value = _uiState.value.copy(showPasswordDialog = user)
    }

    fun dismissPasswordDialog() {
        _uiState.value = _uiState.value.copy(showPasswordDialog = null)
    }

    fun resetPassword(user: User, newPassword: String) {
        viewModelScope.launch {
            adminRepo.resetPassword(user.id, newPassword).fold(
                onSuccess = {
                    _uiState.value = _uiState.value.copy(
                        showPasswordDialog = null,
                        message = "تم إعادة تعيين كلمة المرور لـ ${user.name}"
                    )
                },
                onFailure = { _uiState.value = _uiState.value.copy(error = it.message) }
            )
        }
    }

    fun clearMessage() {
        _uiState.value = _uiState.value.copy(message = null)
    }

    class Factory(private val adminRepo: AdminRepository) : ViewModelProvider.Factory {
        @Suppress("UNCHECKED_CAST")
        override fun <T : ViewModel> create(modelClass: Class<T>): T = UsersViewModel(adminRepo) as T
    }
}
