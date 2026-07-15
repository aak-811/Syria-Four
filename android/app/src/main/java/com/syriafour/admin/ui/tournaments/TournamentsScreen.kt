package com.syriafour.admin.ui.tournaments

import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import com.syriafour.admin.data.model.Tournament
import com.syriafour.admin.ui.components.*
import com.syriafour.admin.ui.theme.*

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun TournamentsScreen(
    viewModel: TournamentsViewModel,
    onBack: () -> Unit
) {
    val uiState by viewModel.uiState.collectAsState()

    LaunchedEffect(uiState.message) {
        if (uiState.message != null) { kotlinx.coroutines.delay(2000); viewModel.clearMessage() }
    }

    Scaffold(
        topBar = { AdminTopBar(title = "البطولات", onBack = onBack) },
        floatingActionButton = {
            FloatingActionButton(onClick = { viewModel.showCreate() }, containerColor = AccentGreen) {
                Icon(Icons.Default.Add, "إضافة بطولة", tint = DarkBackground)
            }
        },
        containerColor = DarkBackground
    ) { padding ->
        when {
            uiState.isLoading -> LoadingIndicator()
            uiState.error != null -> ErrorMessage(uiState.error!!) { viewModel.load() }
            uiState.tournaments.isEmpty() -> EmptyState("لا يوجد بطولات")
            else -> {
                LazyColumn(
                    modifier = Modifier.fillMaxSize().padding(padding).padding(16.dp),
                    verticalArrangement = Arrangement.spacedBy(8.dp)
                ) {
                    items(uiState.tournaments) { tournament ->
                        TournamentCard(
                            tournament = tournament,
                            onEdit = { viewModel.showEdit(tournament) },
                            onDelete = { viewModel.showDelete(tournament) }
                        )
                    }
                }
            }
        }
    }

    uiState.showDeleteDialog?.let { t ->
        ConfirmationDialog("حذف بطولة", "حذف ${t.name}؟",
            onConfirm = { viewModel.delete(t) }, onDismiss = { viewModel.dismissDelete() })
    }

    if (uiState.showCreateDialog) {
        TournamentFormDialog("إضافة بطولة جديدة", onConfirm = { viewModel.create(it) }, onDismiss = { viewModel.dismissCreate() })
    }

    uiState.editingTournament?.let { t ->
        TournamentFormDialog("تعديل ${t.name}", initialData = t,
            onConfirm = { viewModel.edit(t, it) }, onDismiss = { viewModel.dismissEdit() })
    }
}

@Composable
private fun TournamentCard(tournament: Tournament, onEdit: () -> Unit, onDelete: () -> Unit) {
    Card(
        modifier = Modifier.fillMaxWidth(),
        shape = RoundedCornerShape(12.dp),
        colors = CardDefaults.cardColors(containerColor = DarkSurfaceVariant)
    ) {
        Column(modifier = Modifier.padding(16.dp)) {
            Row(verticalAlignment = Alignment.CenterVertically) {
                Icon(Icons.Default.EmojiEvents, null, tint = AccentGold, modifier = Modifier.size(24.dp))
                Spacer(Modifier.width(8.dp))
                Text(tournament.name, style = MaterialTheme.typography.titleMedium, fontWeight = FontWeight.Bold, color = TextPrimary, modifier = Modifier.weight(1f))
                IconButton(onClick = onEdit) { Icon(Icons.Default.Edit, "تعديل", tint = AccentGreen) }
                IconButton(onClick = onDelete) { Icon(Icons.Default.Delete, "حذف", tint = AccentRed) }
            }
            Spacer(Modifier.height(4.dp))
            Row(horizontalArrangement = Arrangement.spacedBy(12.dp)) {
                tournament.type.let { if (it.isNotBlank()) Text(it, color = TextSecondary, style = MaterialTheme.typography.bodySmall) }
                tournament.mode.let { if (it.isNotBlank()) Text(it, color = TextSecondary, style = MaterialTheme.typography.bodySmall) }
                tournament.date.let { if (it.isNotBlank()) Text(it, color = TextSecondary, style = MaterialTheme.typography.bodySmall) }
            }
        }
    }
}

@Composable
private fun TournamentFormDialog(
    title: String,
    initialData: Tournament? = null,
    onConfirm: (Map<String, String>) -> Unit,
    onDismiss: () -> Unit
) {
    var name by remember { mutableStateOf(initialData?.name ?: "") }
    var type by remember { mutableStateOf(initialData?.type ?: "") }
    var mode by remember { mutableStateOf(initialData?.mode ?: "") }
    var mapType by remember { mutableStateOf(initialData?.mapType ?: "") }
    var description by remember { mutableStateOf(initialData?.description ?: "") }
    var date by remember { mutableStateOf(initialData?.date ?: "") }
    var startDate by remember { mutableStateOf(initialData?.startDate ?: "") }
    var endDate by remember { mutableStateOf(initialData?.endDate ?: "") }
    var maxPlayers by remember { mutableStateOf(initialData?.maxPlayers ?: "") }
    var prizeType by remember { mutableStateOf(initialData?.prizeType ?: "") }
    var prizeValue by remember { mutableStateOf(initialData?.prizeValue ?: "") }

    AlertDialog(
        onDismissRequest = onDismiss,
        title = { Text(title) },
        text = {
            Column(
                modifier = Modifier.verticalScroll(androidx.compose.foundation.rememberScrollState()),
                verticalArrangement = Arrangement.spacedBy(8.dp)
            ) {
                TournamentFormField("الاسم", name) { name = it }
                TournamentFormField("النوع", type) { type = it }
                TournamentFormField("الوضع", mode) { mode = it }
                TournamentFormField("نوع الخريطة", mapType) { mapType = it }
                TournamentFormField("الوصف", description) { description = it }
                TournamentFormField("التاريخ", date) { date = it }
                TournamentFormField("تاريخ البداية", startDate) { startDate = it }
                TournamentFormField("تاريخ النهاية", endDate) { endDate = it }
                TournamentFormField("الحد الأقصى", maxPlayers) { maxPlayers = it }
                TournamentFormField("نوع الجائزة", prizeType) { prizeType = it }
                TournamentFormField("قيمة الجائزة", prizeValue) { prizeValue = it }
            }
        },
        confirmButton = {
            TextButton(onClick = {
                onConfirm(mapOf(
                    "name" to name, "type" to type, "mode" to mode, "mapType" to mapType,
                    "description" to description, "date" to date, "startDate" to startDate,
                    "endDate" to endDate, "maxPlayers" to maxPlayers, "prizeType" to prizeType,
                    "prizeValue" to prizeValue
                ))
            }) { Text("حفظ", color = AccentGreen) }
        },
        dismissButton = { TextButton(onClick = onDismiss) { Text("إلغاء") } },
        containerColor = DarkSurface, titleContentColor = TextPrimary, textContentColor = TextSecondary
    )
}

@Composable
private fun TournamentFormField(label: String, value: String, onValueChange: (String) -> Unit) {
    OutlinedTextField(
        value = value, onValueChange = onValueChange, label = { Text(label) },
        singleLine = true, modifier = Modifier.fillMaxWidth(),
        colors = OutlinedTextFieldDefaults.colors(
            focusedTextColor = TextPrimary, unfocusedTextColor = TextPrimary,
            focusedBorderColor = AccentGreen, unfocusedBorderColor = DarkBorder,
            focusedLabelColor = AccentGreen, unfocusedLabelColor = TextSecondary
        )
    )
}
