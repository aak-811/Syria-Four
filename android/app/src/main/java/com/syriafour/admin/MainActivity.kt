package com.syriafour.admin

import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.material3.Surface
import androidx.compose.ui.Modifier
import androidx.navigation.compose.rememberNavController
import com.syriafour.admin.data.session.SessionManager
import com.syriafour.admin.navigation.AppNavigation
import com.syriafour.admin.ui.theme.DarkBackground
import com.syriafour.admin.ui.theme.SyriaFourTheme

class MainActivity : ComponentActivity() {

    private lateinit var sessionManager: SessionManager

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        sessionManager = SessionManager(applicationContext)

        val startDestination = if (sessionManager.isLoggedIn) "dashboard" else "login"

        setContent {
            SyriaFourTheme {
                Surface(
                    modifier = Modifier.fillMaxSize(),
                    color = DarkBackground
                ) {
                    val navController = rememberNavController()
                    AppNavigation(
                        navController = navController,
                        sessionManager = sessionManager,
                        startDestination = startDestination
                    )
                }
            }
        }
    }
}
