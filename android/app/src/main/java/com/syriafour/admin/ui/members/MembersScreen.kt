package com.syriafour.admin.ui.members

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
import com.syriafour.admin.data.model.Member
import com.syriafour.admin.ui.components.*
import com.syriafour.admin.ui.theme.*

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun MembersScreen(
    viewModel: MembersViewModel,
    onBack: () -> Unit
) {
    val uiState by viewModel.uiState.collectAsState()

    LaunchedEffect(uiState.message) {
        if (uiState.message != null) { kotlinx.coroutines.delay(2000); viewModel.clearMessage() }
    }

    Scaffold(
        topBar = {
            AdminTopBar(title = "الأعضاء", onBack = onBack)
        },
        floatingActionButton = {
            FloatingActionButton(onClick = { viewModel.showCreate() }, containerColor = AccentGreen) {
                Icon(Icons.Default.Add, "إضافة عضو", tint = DarkBackground)
            }
        },
        containerColor = DarkBackground
    ) { padding ->
        when {
            uiState.isLoading -> LoadingIndicator()
            uiState.error != null -> ErrorMessage(uiState.error!!) { viewModel.load() }
            uiState.members.isEmpty() -> EmptyState("لا يوجد أعضاء")
            else -> {
                LazyColumn(
                    modifier = Modifier.fillMaxSize().padding(padding).padding(16.dp),
                    verticalArrangement = Arrangement.spacedBy(8.dp)
                ) {
                    items(uiState.members) { member ->
                        MemberCard(
                            member = member,
                            onEdit = { viewModel.showEdit(member) },
                            onDelete = { viewModel.showDelete(member) }
                        )
                    }
                }
            }
        }
    }

    uiState.showDeleteDialog?.let { member ->
        ConfirmationDialog(
            "حذف عضو", "حذف ${member.name}؟",
            onConfirm = { viewModel.delete(member) },
            onDismiss = { viewModel.dismissDelete() }
        )
    }

    if (uiState.showCreateDialog) {
        MemberFormDialog(
            title = "إضافة عضو جديد",
            onConfirm = { data -> viewModel.create(data) },
            onDismiss = { viewModel.dismissCreate() }
        )
    }

    uiState.editingMember?.let { member ->
        MemberFormDialog(
            title = "تعديل ${member.name}",
            initialData = member,
            onConfirm = { data -> viewModel.edit(member, data) },
            onDismiss = { viewModel.dismissEdit() }
        )
    }
}

@Composable
private fun MemberCard(
    member: Member,
    onEdit: () -> Unit,
    onDelete: () -> Unit
) {
    Card(
        modifier = Modifier.fillMaxWidth(),
        shape = RoundedCornerShape(12.dp),
        colors = CardDefaults.cardColors(containerColor = DarkSurfaceVariant)
    ) {
        Row(
            modifier = Modifier.padding(16.dp),
            verticalAlignment = Alignment.CenterVertically
        ) {
            Column(modifier = Modifier.weight(1f)) {
                Text(member.name, style = MaterialTheme.typography.titleMedium, fontWeight = FontWeight.Bold, color = TextPrimary)
                Spacer(Modifier.height(4.dp))
                Row(horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                    StatusBadge(member.role)
                    if (member.level.isNotBlank()) {
                        Text("Level ${member.level}", color = TextSecondary, style = MaterialTheme.typography.bodySmall)
                    }
                }
                if (member.gameId.isNotBlank()) {
                    Text("ID: ${member.gameId}", color = TextSecondary, style = MaterialTheme.typography.bodySmall)
                }
            }
            IconButton(onClick = onEdit) { Icon(Icons.Default.Edit, "تعديل", tint = AccentGreen) }
            IconButton(onClick = onDelete) { Icon(Icons.Default.Delete, "حذف", tint = AccentRed) }
        }
    }
}

@Composable
private fun MemberFormDialog(
    title: String,
    initialData: Member? = null,
    onConfirm: (Map<String, String>) -> Unit,
    onDismiss: () -> Unit
) {
    var name by remember { mutableStateOf(initialData?.name ?: "") }
    var role by remember { mutableStateOf(initialData?.role ?: "") }
    var level by remember { mutableStateOf(initialData?.level ?: "") }
    var gameId by remember { mutableStateOf(initialData?.gameId ?: "") }
    var weapon by remember { mutableStateOf(initialData?.weapon ?: "") }
    var country by remember { mutableStateOf(initialData?.country ?: "") }
    var age by remember { mutableStateOf(initialData?.age ?: "") }
    var wins by remember { mutableStateOf(initialData?.wins?.toString() ?: "") }
    var rank by remember { mutableStateOf(initialData?.rank ?: "") }
    var bio by remember { mutableStateOf(initialData?.bio ?: "") }
    var code by remember { mutableStateOf(initialData?.code ?: "") }

    AlertDialog(
        onDismissRequest = onDismiss,
        title = { Text(title) },
        text = {
            Column(
                modifier = Modifier.verticalScroll(rememberScrollState()),
                verticalArrangement = Arrangement.spacedBy(8.dp)
            ) {
                FormField("الاسم", name) { name = it }
                FormField("الدور", role) { role = it }
                FormField("المستوى", level) { level = it }
                FormField("Game ID", gameId) { gameId = it }
                FormField("السلاح المفضل", weapon) { weapon = it }
                FormField("الدولة", country) { country = it }
                FormField("العمر", age) { age = it }
                FormField("عدد الانتصارات", wins) { wins = it }
                FormField("الرتبة", rank) { rank = it }
                FormField("الرمز", code) { code = it }
                FormField("السيرة", bio) { bio = it }
            }
        },
        confirmButton = {
            TextButton(onClick = {
                onConfirm(mapOf(
                    "name" to name, "role" to role, "level" to level, "gameId" to gameId,
                    "weapon" to weapon, "country" to country, "age" to age, "wins" to wins,
                    "rank" to rank, "bio" to bio, "code" to code
                ))
            }) { Text("حفظ", color = AccentGreen) }
        },
        dismissButton = {
            TextButton(onClick = onDismiss) { Text("إلغاء") }
        },
        containerColor = DarkSurface,
        titleContentColor = TextPrimary,
        textContentColor = TextSecondary
    )
}

@Composable
private fun FormField(label: String, value: String, onValueChange: (String) -> Unit) {
    OutlinedTextField(
        value = value,
        onValueChange = onValueChange,
        label = { Text(label) },
        singleLine = true,
        modifier = Modifier.fillMaxWidth(),
        colors = OutlinedTextFieldDefaults.colors(
            focusedTextColor = TextPrimary, unfocusedTextColor = TextPrimary,
            focusedBorderColor = AccentGreen, unfocusedBorderColor = DarkBorder,
            focusedLabelColor = AccentGreen, unfocusedLabelColor = TextSecondary
        )
    )
}

@Composable
private fun ColumnScope.rememberScrollState() = androidx.compose.foundation.rememberScrollState()
