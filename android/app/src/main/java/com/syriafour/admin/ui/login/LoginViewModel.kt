package com.syriafour.admin.ui.login

import androidx.lifecycle.ViewModel
import androidx.lifecycle.ViewModelProvider
import androidx.lifecycle.viewModelScope
import com.syriafour.admin.data.repository.AuthRepository
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.launch

data class LoginUiState(
    val isLoading: Boolean = false,
    val error: String? = null,
    val isSuccess: Boolean = false
)

class LoginViewModel(private val authRepo: AuthRepository) : ViewModel() {

    private val _uiState = MutableStateFlow(LoginUiState())
    val uiState: StateFlow<LoginUiState> = _uiState

    fun login(email: String, password: String) {
        if (email.isBlank() || password.isBlank()) {
            _uiState.value = LoginUiState(error = "يرجى إدخال البريد الإلكتروني وكلمة المرور")
            return
        }
        viewModelScope.launch {
            _uiState.value = LoginUiState(isLoading = true)
            val result = authRepo.login(email, password)
            result.fold(
                onSuccess = {
                    if (it.user.role != "owner" && it.user.role != "admin") {
                        authRepo.logout()
                        _uiState.value = LoginUiState(error = "ليس لديك صلاحية الوصول إلى لوحة التحكم")
                    } else {
                        _uiState.value = LoginUiState(isSuccess = true)
                    }
                },
                onFailure = {
                    _uiState.value = LoginUiState(error = it.message ?: "فشل تسجيل الدخول")
                }
            )
        }
    }

    class Factory(private val authRepo: AuthRepository) : ViewModelProvider.Factory {
        @Suppress("UNCHECKED_CAST")
        override fun <T : ViewModel> create(modelClass: Class<T>): T = LoginViewModel(authRepo) as T
    }
}
