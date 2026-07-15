package com.syriafour.admin.ui.notifications

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
import com.syriafour.admin.data.model.NotificationItem
import com.syriafour.admin.ui.components.*
import com.syriafour.admin.ui.theme.*

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun NotificationsScreen(
    viewModel: NotificationsViewModel,
    onBack: () -> Unit
) {
    val uiState by viewModel.uiState.collectAsState()

    LaunchedEffect(uiState.message) {
        if (uiState.message != null) { kotlinx.coroutines.delay(2000); viewModel.clearMessage() }
    }

    Scaffold(
        topBar = { AdminTopBar(title = "الإشعارات", onBack = onBack) },
        floatingActionButton = {
            FloatingActionButton(onClick = { viewModel.showCreate() }, containerColor = AccentGreen) {
                Icon(Icons.Default.Add, "إضافة إشعار", tint = DarkBackground)
            }
        },
        containerColor = DarkBackground
    ) { padding ->
        when {
            uiState.isLoading -> LoadingIndicator()
            uiState.error != null -> ErrorMessage(uiState.error!!) { viewModel.load() }
            uiState.notifications.isEmpty() -> EmptyState("لا يوجد إشعارات")
            else -> {
                LazyColumn(
                    modifier = Modifier.fillMaxSize().padding(padding).padding(16.dp),
                    verticalArrangement = Arrangement.spacedBy(8.dp)
                ) {
                    items(uiState.notifications) { notification ->
                        NotificationCard(
                            notification = notification,
                            onEdit = { viewModel.showEdit(notification) },
                            onDelete = { viewModel.showDelete(notification) }
                        )
                    }
                }
            }
        }
    }

    uiState.showDeleteDialog?.let { n ->
        ConfirmationDialog("حذف إشعار", "حذف هذا الإشعار؟",
            onConfirm = { viewModel.delete(n) }, onDismiss = { viewModel.dismissDelete() })
    }

    if (uiState.showCreateDialog) {
        NotificationFormDialog("إضافة إشعار جديد", onConfirm = { viewModel.create(it) }, onDismiss = { viewModel.dismissCreate() })
    }

    uiState.editingNotification?.let { n ->
        NotificationFormDialog("تعديل الإشعار", initialData = n,
            onConfirm = { viewModel.edit(n, it) }, onDismiss = { viewModel.dismissEdit() })
    }
}

@Composable
private fun NotificationCard(
    notification: NotificationItem,
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
            Icon(
                when (notification.type) { "warning" -> Icons.Default.Warning; "error" -> Icons.Default.Error; else -> Icons.Default.Info },
                null,
                tint = when (notification.type) { "warning" -> AccentGold; "error" -> AccentRed; else -> AccentBlue },
                modifier = Modifier.size(32.dp)
            )
            Spacer(Modifier.width(12.dp))
            Column(modifier = Modifier.weight(1f)) {
                Text(notification.message, style = MaterialTheme.typography.bodyMedium, color = TextPrimary)
                Spacer(Modifier.height(4.dp))
                Row(horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                    StatusBadge(notification.type)
                    if (notification.active) StatusBadge("active")
                    Text(notification.date, color = TextSecondary, style = MaterialTheme.typography.bodySmall)
                }
            }
            IconButton(onClick = onEdit) { Icon(Icons.Default.Edit, "تعديل", tint = AccentGreen) }
            IconButton(onClick = onDelete) { Icon(Icons.Default.Delete, "حذف", tint = AccentRed) }
        }
    }
}

@Composable
private fun NotificationFormDialog(
    title: String,
    initialData: NotificationItem? = null,
    onConfirm: (Map<String, String>) -> Unit,
    onDismiss: () -> Unit
) {
    var message by remember { mutableStateOf(initialData?.message ?: "") }
    var type by remember { mutableStateOf(initialData?.type ?: "info") }
    var active by remember { mutableStateOf(initialData?.active?.toString() ?: "false") }

    AlertDialog(
        onDismissRequest = onDismiss,
        title = { Text(title) },
        text = {
            Column(verticalArrangement = Arrangement.spacedBy(8.dp)) {
                OutlinedTextField(
                    value = message, onValueChange = { message = it }, label = { Text("الرسالة") },
                    singleLine = true, modifier = Modifier.fillMaxWidth(),
                    colors = OutlinedTextFieldDefaults.colors(
                        focusedTextColor = TextPrimary, unfocusedTextColor = TextPrimary,
                        focusedBorderColor = AccentGreen, unfocusedBorderColor = DarkBorder,
                        focusedLabelColor = AccentGreen, unfocusedLabelColor = TextSecondary
                    )
                )
                OutlinedTextField(
                    value = type, onValueChange = { type = it }, label = { Text("النوع (info/warning/error)") },
                    singleLine = true, modifier = Modifier.fillMaxWidth(),
                    colors = OutlinedTextFieldDefaults.colors(
                        focusedTextColor = TextPrimary, unfocusedTextColor = TextPrimary,
                        focusedBorderColor = AccentGreen, unfocusedBorderColor = DarkBorder,
                        focusedLabelColor = AccentGreen, unfocusedLabelColor = TextSecondary
                    )
                )
                OutlinedTextField(
                    value = active, onValueChange = { active = it }, label = { Text("مفعل (true/false)") },
                    singleLine = true, modifier = Modifier.fillMaxWidth(),
                    colors = OutlinedTextFieldDefaults.colors(
                        focusedTextColor = TextPrimary, unfocusedTextColor = TextPrimary,
                        focusedBorderColor = AccentGreen, unfocusedBorderColor = DarkBorder,
                        focusedLabelColor = AccentGreen, unfocusedLabelColor = TextSecondary
                    )
                )
            }
        },
        confirmButton = { TextButton(onClick = { onConfirm(mapOf("message" to message, "type" to type, "active" to active)) }) { Text("حفظ", color = AccentGreen) } },
        dismissButton = { TextButton(onClick = onDismiss) { Text("إلغاء") } },
        containerColor = DarkSurface, titleContentColor = TextPrimary, textContentColor = TextSecondary
    )
}
