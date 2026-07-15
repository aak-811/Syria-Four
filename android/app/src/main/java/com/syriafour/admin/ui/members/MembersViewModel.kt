package com.syriafour.admin.ui.members

import androidx.lifecycle.ViewModel
import androidx.lifecycle.ViewModelProvider
import androidx.lifecycle.viewModelScope
import com.syriafour.admin.data.model.Member
import com.syriafour.admin.data.repository.AdminRepository
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.launch

data class MembersUiState(
    val members: List<Member> = emptyList(),
    val isLoading: Boolean = false,
    val error: String? = null,
    val showDeleteDialog: Member? = null,
    val editingMember: Member? = null,
    val showCreateDialog: Boolean = false,
    val message: String? = null
)

class MembersViewModel(private val adminRepo: AdminRepository) : ViewModel() {

    private val _uiState = MutableStateFlow(MembersUiState())
    val uiState: StateFlow<MembersUiState> = _uiState

    init { load() }

    fun load() {
        viewModelScope.launch {
            _uiState.value = _uiState.value.copy(isLoading = true, error = null)
            adminRepo.getMembers().fold(
                onSuccess = { _uiState.value = _uiState.value.copy(members = it, isLoading = false) },
                onFailure = { _uiState.value = _uiState.value.copy(error = it.message, isLoading = false) }
            )
        }
    }

    fun showDelete(member: Member) { _uiState.value = _uiState.value.copy(showDeleteDialog = member) }
    fun dismissDelete() { _uiState.value = _uiState.value.copy(showDeleteDialog = null) }

    fun delete(member: Member) {
        viewModelScope.launch {
            adminRepo.deleteMember(member.id).fold(
                onSuccess = {
                    _uiState.value = _uiState.value.copy(showDeleteDialog = null, message = "تم حذف ${member.name}")
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
            adminRepo.createMember(data).fold(
                onSuccess = {
                    _uiState.value = _uiState.value.copy(showCreateDialog = false, message = "تم إنشاء ${it.name}")
                    load()
                },
                onFailure = { _uiState.value = _uiState.value.copy(error = it.message) }
            )
        }
    }

    fun showEdit(member: Member) { _uiState.value = _uiState.value.copy(editingMember = member) }
    fun dismissEdit() { _uiState.value = _uiState.value.copy(editingMember = null) }

    fun edit(member: Member, data: Map<String, String>) {
        viewModelScope.launch {
            adminRepo.updateMember(member.id, data).fold(
                onSuccess = {
                    _uiState.value = _uiState.value.copy(editingMember = null, message = "تم تحديث ${it.name}")
                    load()
                },
                onFailure = { _uiState.value = _uiState.value.copy(error = it.message) }
            )
        }
    }

    fun clearMessage() { _uiState.value = _uiState.value.copy(message = null) }

    class Factory(private val adminRepo: AdminRepository) : ViewModelProvider.Factory {
        @Suppress("UNCHECKED_CAST")
        override fun <T : ViewModel> create(modelClass: Class<T>): T = MembersViewModel(adminRepo) as T
    }
}
