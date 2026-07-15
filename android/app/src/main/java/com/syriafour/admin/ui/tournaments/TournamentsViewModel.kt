package com.syriafour.admin.ui.tournaments

import androidx.lifecycle.ViewModel
import androidx.lifecycle.ViewModelProvider
import androidx.lifecycle.viewModelScope
import com.syriafour.admin.data.model.Tournament
import com.syriafour.admin.data.repository.AdminRepository
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.launch

data class TournamentsUiState(
    val tournaments: List<Tournament> = emptyList(),
    val isLoading: Boolean = false,
    val error: String? = null,
    val showDeleteDialog: Tournament? = null,
    val editingTournament: Tournament? = null,
    val showCreateDialog: Boolean = false,
    val message: String? = null
)

class TournamentsViewModel(private val adminRepo: AdminRepository) : ViewModel() {

    private val _uiState = MutableStateFlow(TournamentsUiState())
    val uiState: StateFlow<TournamentsUiState> = _uiState

    init { load() }

    fun load() {
        viewModelScope.launch {
            _uiState.value = _uiState.value.copy(isLoading = true, error = null)
            adminRepo.getTournaments().fold(
                onSuccess = { _uiState.value = _uiState.value.copy(tournaments = it, isLoading = false) },
                onFailure = { _uiState.value = _uiState.value.copy(error = it.message, isLoading = false) }
            )
        }
    }

    fun showDelete(t: Tournament) { _uiState.value = _uiState.value.copy(showDeleteDialog = t) }
    fun dismissDelete() { _uiState.value = _uiState.value.copy(showDeleteDialog = null) }

    fun delete(t: Tournament) {
        viewModelScope.launch {
            adminRepo.deleteTournament(t.id).fold(
                onSuccess = {
                    _uiState.value = _uiState.value.copy(showDeleteDialog = null, message = "تم حذف ${t.name}")
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
            adminRepo.createTournament(data).fold(
                onSuccess = {
                    _uiState.value = _uiState.value.copy(showCreateDialog = false, message = "تم إنشاء ${it.name}")
                    load()
                },
                onFailure = { _uiState.value = _uiState.value.copy(error = it.message) }
            )
        }
    }

    fun showEdit(t: Tournament) { _uiState.value = _uiState.value.copy(editingTournament = t) }
    fun dismissEdit() { _uiState.value = _uiState.value.copy(editingTournament = null) }

    fun edit(t: Tournament, data: Map<String, String>) {
        viewModelScope.launch {
            adminRepo.updateTournament(t.id, data).fold(
                onSuccess = {
                    _uiState.value = _uiState.value.copy(editingTournament = null, message = "تم تحديث ${it.name}")
                    load()
                },
                onFailure = { _uiState.value = _uiState.value.copy(error = it.message) }
            )
        }
    }

    fun clearMessage() { _uiState.value = _uiState.value.copy(message = null) }

    class Factory(private val adminRepo: AdminRepository) : ViewModelProvider.Factory {
        @Suppress("UNCHECKED_CAST")
        override fun <T : ViewModel> create(modelClass: Class<T>): T = TournamentsViewModel(adminRepo) as T
    }
}
