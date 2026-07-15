package com.syriafour.admin.ui.orders

import androidx.lifecycle.ViewModel
import androidx.lifecycle.ViewModelProvider
import androidx.lifecycle.viewModelScope
import com.syriafour.admin.data.model.Order
import com.syriafour.admin.data.repository.AdminRepository
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.launch

data class OrdersUiState(
    val orders: List<Order> = emptyList(),
    val isLoading: Boolean = false,
    val error: String? = null,
    val showDeleteDialog: Order? = null,
    val message: String? = null
)

class OrdersViewModel(private val adminRepo: AdminRepository) : ViewModel() {

    private val _uiState = MutableStateFlow(OrdersUiState())
    val uiState: StateFlow<OrdersUiState> = _uiState

    init { load() }

    fun load() {
        viewModelScope.launch {
            _uiState.value = _uiState.value.copy(isLoading = true, error = null)
            adminRepo.getOrders().fold(
                onSuccess = { _uiState.value = _uiState.value.copy(orders = it, isLoading = false) },
                onFailure = { _uiState.value = _uiState.value.copy(error = it.message, isLoading = false) }
            )
        }
    }

    fun updateStatus(order: Order, status: String) {
        viewModelScope.launch {
            adminRepo.updateOrderStatus(order.id, status).fold(
                onSuccess = { _uiState.value = _uiState.value.copy(message = "تم تحديث الطلب") }
            ) { _uiState.value = _uiState.value.copy(error = it.message) }
            load()
        }
    }

    fun showDelete(order: Order) { _uiState.value = _uiState.value.copy(showDeleteDialog = order) }
    fun dismissDelete() { _uiState.value = _uiState.value.copy(showDeleteDialog = null) }

    fun delete(order: Order) {
        viewModelScope.launch {
            adminRepo.deleteOrder(order.id).fold(
                onSuccess = { _uiState.value = _uiState.value.copy(showDeleteDialog = null, message = "تم حذف الطلب") },
                onFailure = { _uiState.value = _uiState.value.copy(error = it.message) }
            )
            load()
        }
    }

    fun clearMessage() { _uiState.value = _uiState.value.copy(message = null) }

    class Factory(private val adminRepo: AdminRepository) : ViewModelProvider.Factory {
        @Suppress("UNCHECKED_CAST")
        override fun <T : ViewModel> create(modelClass: Class<T>): T = OrdersViewModel(adminRepo) as T
    }
}
