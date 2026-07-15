package com.syriafour.admin.ui.users

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
import com.syriafour.admin.data.model.User
import com.syriafour.admin.ui.components.*
import com.syriafour.admin.ui.theme.*

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun UsersScreen(
    viewModel: UsersViewModel,
    onBack: () -> Unit
) {
    val uiState by viewModel.uiState.collectAsState()
    var selectedUser by remember { mutableStateOf<User?>(null) }
    var showDetailDialog by remember { mutableStateOf(false) }

    LaunchedEffect(uiState.message) {
        if (uiState.message != null) {
            kotlinx.coroutines.delay(2000)
            viewModel.clearMessage()
        }
    }

    Scaffold(
        topBar = { AdminTopBar(title = "المستخدمين", onBack = onBack) },
        containerColor = DarkBackground
    ) { padding ->
        when {
            uiState.isLoading -> LoadingIndicator()
            uiState.error != null -> ErrorMessage(uiState.error!!) { viewModel.loadUsers() }
            uiState.users.isEmpty() -> EmptyState("لا يوجد مستخدمين")
            else -> {
                LazyColumn(
                    modifier = Modifier.fillMaxSize().padding(padding).padding(16.dp),
                    verticalArrangement = Arrangement.spacedBy(8.dp)
                ) {
                    items(uiState.users) { user ->
                        UserCard(
                            user = user,
                            onShowDetail = {
                                selectedUser = user
                                showDetailDialog = true
                            },
                            onDelete = { viewModel.showDeleteDialog(user) },
                            onChangeRole = { viewModel.showRoleDialog(user) },
                            onResetPassword = { viewModel.showPasswordDialog(user) }
                        )
                    }
                }

                if (uiState.message != null) {
                    Snackbar(
                        modifier = Modifier.padding(16.dp),
                        containerColor = AccentGreen
                    ) {
                        Text(uiState.message!!, color = DarkBackground)
                    }
                }
            }
        }
    }

    // Delete confirmation
    uiState.showDeleteDialog?.let { user ->
        ConfirmationDialog(
            title = "حذف مستخدم",
            message = "هل أنت متأكد من حذف ${user.name}؟",
            onConfirm = { viewModel.deleteUser(user) },
            onDismiss = { viewModel.dismissDeleteDialog() }
        )
    }

    // Role dialog
    uiState.showRoleDialog?.let { user ->
        RoleChangeDialog(
            user = user,
            onConfirm = { role -> viewModel.updateRole(user, role) },
            onDismiss = { viewModel.dismissRoleDialog() }
        )
    }

    // Password dialog
    uiState.showPasswordDialog?.let { user ->
        PasswordResetDialog(
            user = user,
            onConfirm = { pwd -> viewModel.resetPassword(user, pwd) },
            onDismiss = { viewModel.dismissPasswordDialog() }
        )
    }

    // User detail dialog
    if (showDetailDialog && selectedUser != null) {
        UserDetailDialog(
            user = selectedUser!!,
            onDismiss = { showDetailDialog = false }
        )
    }
}

@Composable
private fun UserCard(
    user: User,
    onShowDetail: () -> Unit,
    onDelete: () -> Unit,
    onChangeRole: () -> Unit,
    onResetPassword: () -> Unit
) {
    Card(
        onClick = onShowDetail,
        modifier = Modifier.fillMaxWidth(),
        shape = RoundedCornerShape(12.dp),
        colors = CardDefaults.cardColors(containerColor = DarkSurfaceVariant)
    ) {
        Row(
            modifier = Modifier.padding(16.dp),
            verticalAlignment = Alignment.CenterVertically
        ) {
            Column(modifier = Modifier.weight(1f)) {
                Text(text = user.name, style = MaterialTheme.typography.titleMedium, fontWeight = FontWeight.Bold, color = TextPrimary)
                Text(text = user.email, style = MaterialTheme.typography.bodySmall, color = TextSecondary)
                Spacer(Modifier.height(4.dp))
                Row(horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                    StatusBadge(user.role)
                    StatusBadge(user.status)
                }
            }
            IconButton(onClick = onChangeRole) {
                Icon(Icons.Default.AdminPanelSettings, "تغيير الدور", tint = AccentGreen)
            }
            IconButton(onClick = onResetPassword) {
                Icon(Icons.Default.Key, "إعادة تعيين كلمة المرور", tint = AccentGold)
            }
            IconButton(onClick = onDelete) {
                Icon(Icons.Default.Delete, "حذف", tint = AccentRed)
            }
        }
    }
}

@Composable
private fun RoleChangeDialog(
    user: User,
    onConfirm: (String) -> Unit,
    onDismiss: () -> Unit
) {
    val roles = listOf("member", "admin", "moderator", "owner", "guest")
    var selectedRole by remember { mutableStateOf(user.role) }

    AlertDialog(
        onDismissRequest = onDismiss,
        title = { Text("تغيير دور ${user.name}") },
        text = {
            Column {
                roles.forEach { role ->
                    Row(
                        verticalAlignment = Alignment.CenterVertically,
                        modifier = Modifier.fillMaxWidth().padding(vertical = 4.dp)
                    ) {
                        RadioButton(
                            selected = selectedRole == role,
                            onClick = { selectedRole = role },
                            colors = RadioButtonDefaults.colors(selectedColor = AccentGreen)
                        )
                        Spacer(Modifier.width(8.dp))
                        Text(role, color = TextPrimary)
                    }
                }
            }
        },
        confirmButton = {
            TextButton(onClick = { onConfirm(selectedRole) }) {
                Text("تأكيد", color = AccentGreen)
            }
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
private fun PasswordResetDialog(
    user: User,
    onConfirm: (String) -> Unit,
    onDismiss: () -> Unit
) {
    var password by remember { mutableStateOf("") }
    var confirmPassword by remember { mutableStateOf("") }
    var error by remember { mutableStateOf<String?>(null) }

    AlertDialog(
        onDismissRequest = onDismiss,
        title = { Text("إعادة تعيين كلمة المرور") },
        text = {
            Column {
                Text("المستخدم: ${user.name}", color = TextSecondary)
                Spacer(Modifier.height(12.dp))
                OutlinedTextField(
                    value = password,
                    onValueChange = { password = it; error = null },
                    label = { Text("كلمة المرور الجديدة") },
                    singleLine = true,
                    modifier = Modifier.fillMaxWidth(),
                    colors = OutlinedTextFieldDefaults.colors(
                        focusedTextColor = TextPrimary, unfocusedTextColor = TextPrimary,
                        focusedBorderColor = AccentGreen, unfocusedBorderColor = DarkBorder
                    )
                )
                Spacer(Modifier.height(8.dp))
                OutlinedTextField(
                    value = confirmPassword,
                    onValueChange = { confirmPassword = it; error = null },
                    label = { Text("تأكيد كلمة المرور") },
                    singleLine = true,
                    modifier = Modifier.fillMaxWidth(),
                    colors = OutlinedTextFieldDefaults.colors(
                        focusedTextColor = TextPrimary, unfocusedTextColor = TextPrimary,
                        focusedBorderColor = AccentGreen, unfocusedBorderColor = DarkBorder
                    )
                )
                if (error != null) {
                    Text(error!!, color = AccentRed, style = MaterialTheme.typography.bodySmall)
                }
            }
        },
        confirmButton = {
            TextButton(onClick = {
                when {
                    password.length < 6 -> error = "كلمة المرور يجب أن تكون 6 أحرف على الأقل"
                    password != confirmPassword -> error = "كلمة المرور غير متطابقة"
                    else -> onConfirm(password)
                }
            }) {
                Text("تأكيد", color = AccentGreen)
            }
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
private fun UserDetailDialog(user: User, onDismiss: () -> Unit) {
    AlertDialog(
        onDismissRequest = onDismiss,
        title = { Text(user.name) },
        text = {
            Column(verticalArrangement = Arrangement.spacedBy(8.dp)) {
                DetailRow("البريد", user.email)
                DetailRow("اسم المستخدم", user.username)
                DetailRow("الدور", user.role)
                DetailRow("الحالة", user.status)
                DetailRow("موثق", if (user.verified) "نعم" else "لا")
                DetailRow("الدولة", user.country)
                DetailRow("الهاتف", user.phone)
                DetailRow("Free Fire UID", user.ffUid)
                DetailRow("Free Fire IGN", user.ffIgn)
                DetailRow("تاريخ الانضمام", user.joinDate)
                DetailRow("آخر تسجيل دخول", user.lastLogin)
                DetailRow("السيرة", user.bio)
                DetailRow("Instagram", user.instagram)
                DetailRow("Discord", user.discord)
            }
        },
        confirmButton = {
            TextButton(onClick = onDismiss) { Text("إغلاق", color = AccentGreen) }
        },
        containerColor = DarkSurface,
        titleContentColor = TextPrimary,
        textContentColor = TextSecondary
    )
}

@Composable
private fun DetailRow(label: String, value: String) {
    Row {
        Text("$label: ", color = AccentGreen, style = MaterialTheme.typography.bodySmall)
        Text(if (value.isBlank()) "—" else value, color = TextPrimary, style = MaterialTheme.typography.bodySmall)
    }
}
