package com.syriafour.admin.data.repository

import com.syriafour.admin.data.api.ApiService
import com.syriafour.admin.data.model.LoginRequest
import com.syriafour.admin.data.model.LoginResponse
import com.syriafour.admin.data.model.MeResponse
import com.syriafour.admin.data.session.SessionManager

class AuthRepository(
    private val api: ApiService,
    private val session: SessionManager
) {
    suspend fun login(email: String, password: String): Result<LoginResponse> {
        return try {
            val response = api.login(LoginRequest(email, password))
            if (response.isSuccessful) {
                val body = response.body()!!
                session.saveUser(
                    id = body.user.id,
                    name = body.user.name,
                    email = body.user.email,
                    role = body.user.role,
                    token = body.token
                )
                Result.success(body)
            } else {
                val errorBody = response.errorBody()?.string() ?: "فشل تسجيل الدخول"
                Result.failure(Exception(errorBody))
            }
        } catch (e: Exception) {
            Result.failure(Exception("خطأ في الاتصال: ${e.localizedMessage}"))
        }
    }

    suspend fun getMe(): Result<MeResponse> {
        return try {
            val response = api.getMe()
            if (response.isSuccessful) {
                Result.success(response.body()!!)
            } else {
                Result.failure(Exception("فشل في التحقق من الجلسة"))
            }
        } catch (e: Exception) {
            Result.failure(Exception("خطأ في الاتصال: ${e.localizedMessage}"))
        }
    }

    fun isLoggedIn(): Boolean = session.isLoggedIn

    fun logout() = session.logout()

    val userRole: String? get() = session.userRole
}
