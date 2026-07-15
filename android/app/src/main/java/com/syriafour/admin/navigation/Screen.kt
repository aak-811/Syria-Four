package com.syriafour.admin.navigation

sealed class Screen(val route: String) {
    data object Login : Screen("login")
    data object Dashboard : Screen("dashboard")
    data object Users : Screen("users")
    data object Members : Screen("members")
    data object Tournaments : Screen("tournaments")
    data object Orders : Screen("orders")
    data object Support : Screen("support")
    data object Notifications : Screen("notifications")
    data object AuditLogs : Screen("audit_logs")
}
