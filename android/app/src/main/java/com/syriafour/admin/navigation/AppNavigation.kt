package com.syriafour.admin.navigation

import androidx.compose.runtime.Composable
import androidx.navigation.NavHostController
import androidx.navigation.compose.NavHost
import androidx.navigation.compose.composable
import com.syriafour.admin.data.api.RetrofitClient
import com.syriafour.admin.data.repository.AdminRepository
import com.syriafour.admin.data.repository.AuthRepository
import com.syriafour.admin.data.session.SessionManager
import com.syriafour.admin.ui.dashboard.DashboardScreen
import com.syriafour.admin.ui.dashboard.DashboardViewModel
import com.syriafour.admin.ui.login.LoginScreen
import com.syriafour.admin.ui.login.LoginViewModel
import com.syriafour.admin.ui.logs.AuditLogsScreen
import com.syriafour.admin.ui.logs.AuditLogsViewModel
import com.syriafour.admin.ui.members.MembersScreen
import com.syriafour.admin.ui.members.MembersViewModel
import com.syriafour.admin.ui.notifications.NotificationsScreen
import com.syriafour.admin.ui.notifications.NotificationsViewModel
import com.syriafour.admin.ui.orders.OrdersScreen
import com.syriafour.admin.ui.orders.OrdersViewModel
import com.syriafour.admin.ui.support.SupportScreen
import com.syriafour.admin.ui.support.SupportViewModel
import com.syriafour.admin.ui.tournaments.TournamentsScreen
import com.syriafour.admin.ui.tournaments.TournamentsViewModel
import com.syriafour.admin.ui.users.UsersScreen
import com.syriafour.admin.ui.users.UsersViewModel

@Composable
fun AppNavigation(
    navController: NavHostController,
    sessionManager: SessionManager,
    startDestination: String
) {
    val api = RetrofitClient.getApiService(sessionManager)
    val authRepo = AuthRepository(api, sessionManager)
    val adminRepo = AdminRepository(api)

    NavHost(navController = navController, startDestination = startDestination) {
        composable("login") {
            val viewModel = LoginViewModel(authRepo)
            LoginScreen(
                viewModel = viewModel,
                onLoginSuccess = {
                    navController.navigate("dashboard") {
                        popUpTo("login") { inclusive = true }
                    }
                }
            )
        }

        composable("dashboard") {
            val viewModel = DashboardViewModel(adminRepo, authRepo)
            DashboardScreen(
                viewModel = viewModel,
                onNavigate = { route -> navController.navigate(route) },
                onLogout = {
                    navController.navigate("login") {
                        popUpTo(0) { inclusive = true }
                    }
                }
            )
        }

        composable("users") {
            val viewModel = UsersViewModel(adminRepo)
            UsersScreen(
                viewModel = viewModel,
                onBack = { navController.popBackStack() }
            )
        }

        composable("members") {
            val viewModel = MembersViewModel(adminRepo)
            MembersScreen(
                viewModel = viewModel,
                onBack = { navController.popBackStack() }
            )
        }

        composable("tournaments") {
            val viewModel = TournamentsViewModel(adminRepo)
            TournamentsScreen(
                viewModel = viewModel,
                onBack = { navController.popBackStack() }
            )
        }

        composable("orders") {
            val viewModel = OrdersViewModel(adminRepo)
            OrdersScreen(
                viewModel = viewModel,
                onBack = { navController.popBackStack() }
            )
        }

        composable("support") {
            val viewModel = SupportViewModel(adminRepo)
            SupportScreen(
                viewModel = viewModel,
                onBack = { navController.popBackStack() }
            )
        }

        composable("notifications") {
            val viewModel = NotificationsViewModel(adminRepo)
            NotificationsScreen(
                viewModel = viewModel,
                onBack = { navController.popBackStack() }
            )
        }

        composable("audit_logs") {
            val viewModel = AuditLogsViewModel(adminRepo)
            AuditLogsScreen(
                viewModel = viewModel,
                onBack = { navController.popBackStack() }
            )
        }
    }
}
