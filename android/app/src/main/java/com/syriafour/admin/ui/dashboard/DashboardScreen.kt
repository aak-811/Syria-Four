package com.syriafour.admin.ui.dashboard

import androidx.compose.foundation.layout.*
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.verticalScroll
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Modifier
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import com.syriafour.admin.ui.components.*
import com.syriafour.admin.ui.theme.*

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun DashboardScreen(
    viewModel: DashboardViewModel,
    onNavigate: (String) -> Unit,
    onLogout: () -> Unit
) {
    val uiState by viewModel.uiState.collectAsState()

    Scaffold(
        topBar = {
            AdminTopBar(
                title = "لوحة التحكم",
                onLogout = {
                    viewModel.logout()
                    onLogout()
                }
            )
        },
        containerColor = DarkBackground
    ) { padding ->
        when {
            uiState.isLoading -> LoadingIndicator()
            uiState.error != null -> ErrorMessage(uiState.error!!) { viewModel.loadDashboard() }
            else -> {
                Column(
                    modifier = Modifier
                        .fillMaxSize()
                        .padding(padding)
                        .padding(16.dp)
                        .verticalScroll(rememberScrollState()),
                    verticalArrangement = Arrangement.spacedBy(16.dp)
                ) {
                    Text(
                        text = "مرحباً، ${uiState.userName}",
                        style = MaterialTheme.typography.headlineSmall,
                        fontWeight = FontWeight.Bold,
                        color = TextPrimary
                    )
                    Text(
                        text = "${uiState.userEmail} • ${uiState.userRole}",
                        style = MaterialTheme.typography.bodyMedium,
                        color = TextSecondary
                    )

                    Spacer(Modifier.height(8.dp))

                    Row(
                        modifier = Modifier.fillMaxWidth(),
                        horizontalArrangement = Arrangement.spacedBy(12.dp)
                    ) {
                        StatCard(
                            label = "المستخدمين",
                            value = uiState.userCount.toString(),
                            color = AccentBlue,
                            modifier = Modifier.weight(1f)
                        )
                        StatCard(
                            label = "الأعضاء",
                            value = uiState.memberCount.toString(),
                            color = AccentGreen,
                            modifier = Modifier.weight(1f)
                        )
                    }

                    Row(
                        modifier = Modifier.fillMaxWidth(),
                        horizontalArrangement = Arrangement.spacedBy(12.dp)
                    ) {
                        StatCard(
                            label = "الطلبات",
                            value = uiState.orderCount.toString(),
                            color = AccentGold,
                            modifier = Modifier.weight(1f)
                        )
                        StatCard(
                            label = "التذاكر",
                            value = uiState.ticketCount.toString(),
                            color = AccentRed,
                            modifier = Modifier.weight(1f)
                        )
                    }

                    Spacer(Modifier.height(8.dp))
                    Text(
                        text = "الإدارة",
                        style = MaterialTheme.typography.titleLarge,
                        fontWeight = FontWeight.Bold,
                        color = TextPrimary
                    )
                    Spacer(Modifier.height(4.dp))

                    DashboardActionCard("المستخدمين", Icons.Default.People) { onNavigate("users") }
                    DashboardActionCard("الأعضاء", Icons.Default.Groups) { onNavigate("members") }
                    DashboardActionCard("البطولات", Icons.Default.EmojiEvents) { onNavigate("tournaments") }
                    DashboardActionCard("الطلبات", Icons.Default.ShoppingCart) { onNavigate("orders") }
                    DashboardActionCard("الدعم", Icons.Default.SupportAgent) { onNavigate("support") }
                    DashboardActionCard("الإشعارات", Icons.Default.Notifications) { onNavigate("notifications") }
                    DashboardActionCard("سجل النشاطات", Icons.Default.History) { onNavigate("audit_logs") }

                    Spacer(Modifier.height(16.dp))
                }
            }
        }
    }
}
