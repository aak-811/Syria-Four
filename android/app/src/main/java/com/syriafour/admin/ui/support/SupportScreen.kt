package com.syriafour.admin.ui.support

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
import com.syriafour.admin.data.model.SupportTicket
import com.syriafour.admin.ui.components.*
import com.syriafour.admin.ui.theme.*

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun SupportScreen(
    viewModel: SupportViewModel,
    onBack: () -> Unit
) {
    val uiState by viewModel.uiState.collectAsState()

    LaunchedEffect(uiState.message) {
        if (uiState.message != null) { kotlinx.coroutines.delay(2000); viewModel.clearMessage() }
    }

    Scaffold(
        topBar = { AdminTopBar(title = "تذاكر الدعم", onBack = onBack) },
        containerColor = DarkBackground
    ) { padding ->
        when {
            uiState.isLoading -> LoadingIndicator()
            uiState.error != null -> ErrorMessage(uiState.error!!) { viewModel.load() }
            uiState.tickets.isEmpty() -> EmptyState("لا يوجد تذاكر دعم")
            else -> {
                LazyColumn(
                    modifier = Modifier.fillMaxSize().padding(padding).padding(16.dp),
                    verticalArrangement = Arrangement.spacedBy(8.dp)
                ) {
                    items(uiState.tickets) { ticket ->
                        SupportCard(
                            ticket = ticket,
                            onStatusChange = { status -> viewModel.updateStatus(ticket, status) },
                            onDelete = { viewModel.showDelete(ticket) }
                        )
                    }
                }
            }
        }
    }

    uiState.showDeleteDialog?.let { ticket ->
        ConfirmationDialog("حذف تذكرة", "حذف تذكرة ${ticket.playerName}؟",
            onConfirm = { viewModel.delete(ticket) }, onDismiss = { viewModel.dismissDelete() })
    }
}

@Composable
private fun SupportCard(
    ticket: SupportTicket,
    onStatusChange: (String) -> Unit,
    onDelete: () -> Unit
) {
    var showStatusMenu by remember { mutableStateOf(false) }
    var showDetail by remember { mutableStateOf(false) }

    Card(
        onClick = { showDetail = true },
        modifier = Modifier.fillMaxWidth(),
        shape = RoundedCornerShape(12.dp),
        colors = CardDefaults.cardColors(containerColor = DarkSurfaceVariant)
    ) {
        Column(modifier = Modifier.padding(16.dp)) {
            Row(verticalAlignment = Alignment.CenterVertically) {
                Column(modifier = Modifier.weight(1f)) {
                    Text(ticket.playerName, style = MaterialTheme.typography.titleMedium, fontWeight = FontWeight.Bold, color = TextPrimary)
                    Text(ticket.type, style = MaterialTheme.typography.bodySmall, color = TextSecondary)
                }
                Box {
                    IconButton(onClick = { showStatusMenu = true }) { Icon(Icons.Default.MoreVert, "تغيير الحالة", tint = TextSecondary) }
                    DropdownMenu(expanded = showStatusMenu, onDismissRequest = { showStatusMenu = false }) {
                        listOf("pending", "active", "resolved", "closed").forEach { s ->
                            DropdownMenuItem(text = { Text(s) }, onClick = { onStatusChange(s); showStatusMenu = false })
                        }
                    }
                }
                IconButton(onClick = onDelete) { Icon(Icons.Default.Delete, "حذف", tint = AccentRed) }
            }
            Spacer(Modifier.height(4.dp))
            Row(horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                StatusBadge(ticket.status)
                Text(ticket.date, color = TextSecondary, style = MaterialTheme.typography.bodySmall)
            }
        }
    }

    if (showDetail) {
        AlertDialog(
            onDismissRequest = { showDetail = false },
            title = { Text(ticket.playerName) },
            text = {
                Column(verticalArrangement = Arrangement.spacedBy(8.dp)) {
                    Text("النوع: ${ticket.type}", color = TextPrimary)
                    Text("الحالة: ${ticket.status}", color = TextPrimary)
                    Text("التاريخ: ${ticket.date}", color = TextPrimary)
                    Spacer(Modifier.height(8.dp))
                    Text("الرسالة:", color = AccentGreen, fontWeight = FontWeight.Bold)
                    Text(ticket.message, color = TextPrimary)
                }
            },
            confirmButton = { TextButton(onClick = { showDetail = false }) { Text("إغلاق", color = AccentGreen) } },
            containerColor = DarkSurface, titleContentColor = TextPrimary, textContentColor = TextSecondary
        )
    }
}
