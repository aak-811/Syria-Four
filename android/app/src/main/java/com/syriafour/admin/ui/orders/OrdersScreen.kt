package com.syriafour.admin.ui.orders

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
import com.syriafour.admin.data.model.Order
import com.syriafour.admin.ui.components.*
import com.syriafour.admin.ui.theme.*

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun OrdersScreen(
    viewModel: OrdersViewModel,
    onBack: () -> Unit
) {
    val uiState by viewModel.uiState.collectAsState()

    LaunchedEffect(uiState.message) {
        if (uiState.message != null) { kotlinx.coroutines.delay(2000); viewModel.clearMessage() }
    }

    Scaffold(
        topBar = { AdminTopBar(title = "الطلبات", onBack = onBack) },
        containerColor = DarkBackground
    ) { padding ->
        when {
            uiState.isLoading -> LoadingIndicator()
            uiState.error != null -> ErrorMessage(uiState.error!!) { viewModel.load() }
            uiState.orders.isEmpty() -> EmptyState("لا يوجد طلبات")
            else -> {
                LazyColumn(
                    modifier = Modifier.fillMaxSize().padding(padding).padding(16.dp),
                    verticalArrangement = Arrangement.spacedBy(8.dp)
                ) {
                    items(uiState.orders) { order ->
                        OrderCard(
                            order = order,
                            onStatusChange = { status -> viewModel.updateStatus(order, status) },
                            onDelete = { viewModel.showDelete(order) }
                        )
                    }
                }
            }
        }
    }

    uiState.showDeleteDialog?.let { order ->
        ConfirmationDialog("حذف طلب", "حذف طلب ${order.playerName}؟",
            onConfirm = { viewModel.delete(order) }, onDismiss = { viewModel.dismissDelete() })
    }
}

@Composable
private fun OrderCard(
    order: Order,
    onStatusChange: (String) -> Unit,
    onDelete: () -> Unit
) {
    var showStatusMenu by remember { mutableStateOf(false) }
    val statuses = listOf("pending", "processing", "completed", "cancelled")

    Card(
        modifier = Modifier.fillMaxWidth(),
        shape = RoundedCornerShape(12.dp),
        colors = CardDefaults.cardColors(containerColor = DarkSurfaceVariant)
    ) {
        Column(modifier = Modifier.padding(16.dp)) {
            Row(verticalAlignment = Alignment.CenterVertically) {
                Column(modifier = Modifier.weight(1f)) {
                    Text(order.playerName, style = MaterialTheme.typography.titleMedium, fontWeight = FontWeight.Bold, color = TextPrimary)
                    Text(order.item, style = MaterialTheme.typography.bodySmall, color = TextSecondary)
                }
                Box {
                    IconButton(onClick = { showStatusMenu = true }) { Icon(Icons.Default.MoreVert, "تغيير الحالة", tint = TextSecondary) }
                    DropdownMenu(expanded = showStatusMenu, onDismissRequest = { showStatusMenu = false }) {
                        statuses.forEach { status ->
                            DropdownMenuItem(
                                text = { Text(status) },
                                onClick = { onStatusChange(status); showStatusMenu = false }
                            )
                        }
                    }
                }
                IconButton(onClick = onDelete) { Icon(Icons.Default.Delete, "حذف", tint = AccentRed) }
            }
            Spacer(Modifier.height(8.dp))
            Row(horizontalArrangement = Arrangement.spacedBy(12.dp)) {
                StatusBadge(order.status)
                Text("ID: ${order.playerId}", color = TextSecondary, style = MaterialTheme.typography.bodySmall)
                Text(order.payment, color = TextSecondary, style = MaterialTheme.typography.bodySmall)
                Text(order.date, color = TextSecondary, style = MaterialTheme.typography.bodySmall)
            }
        }
    }
}
