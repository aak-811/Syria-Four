package com.syriafour.admin.data.repository

import com.syriafour.admin.data.api.ApiService
import com.syriafour.admin.data.model.*

class AdminRepository(private val api: ApiService) {

    // Users
    suspend fun getUsers(): Result<List<User>> {
        return try {
            val response = api.getUsers()
            if (response.isSuccessful) Result.success(response.body()!!.users)
            else Result.failure(Exception("فشل تحميل المستخدمين"))
        } catch (e: Exception) {
            Result.failure(Exception("خطأ في الاتصال: ${e.localizedMessage}"))
        }
    }

    suspend fun updateUser(id: String, body: UserUpdateRequest): Result<User> {
        return try {
            val response = api.updateUser(id, body)
            if (response.isSuccessful) Result.success(response.body()!!.user)
            else Result.failure(Exception("فشل تحديث المستخدم"))
        } catch (e: Exception) {
            Result.failure(Exception("خطأ في الاتصال: ${e.localizedMessage}"))
        }
    }

    suspend fun deleteUser(id: String): Result<Boolean> {
        return try {
            val response = api.deleteUser(id)
            if (response.isSuccessful) Result.success(true)
            else Result.failure(Exception("فشل حذف المستخدم"))
        } catch (e: Exception) {
            Result.failure(Exception("خطأ في الاتصال: ${e.localizedMessage}"))
        }
    }

    suspend fun resetPassword(id: String, newPassword: String): Result<Boolean> {
        return try {
            val response = api.resetPassword(id, ResetPasswordRequest(newPassword))
            if (response.isSuccessful) Result.success(true)
            else Result.failure(Exception("فشل إعادة تعيين كلمة المرور"))
        } catch (e: Exception) {
            Result.failure(Exception("خطأ في الاتصال: ${e.localizedMessage}"))
        }
    }

    // Audit Logs
    suspend fun getAuditLogs(): Result<List<AuditLog>> {
        return try {
            val response = api.getAuditLogs()
            if (response.isSuccessful) Result.success(response.body()!!.logs)
            else Result.failure(Exception("فشل تحميل سجل النشاطات"))
        } catch (e: Exception) {
            Result.failure(Exception("خطأ في الاتصال: ${e.localizedMessage}"))
        }
    }

    // Members
    suspend fun getMembers(): Result<List<Member>> {
        return try {
            val response = api.getMembers()
            if (response.isSuccessful) Result.success(response.body()!!)
            else Result.failure(Exception("فشل تحميل الأعضاء"))
        } catch (e: Exception) {
            Result.failure(Exception("خطأ في الاتصال: ${e.localizedMessage}"))
        }
    }

    suspend fun createMember(data: Map<String, String>): Result<Member> {
        return try {
            val response = api.createMember(data)
            if (response.isSuccessful) Result.success(response.body()!!)
            else Result.failure(Exception("فشل إنشاء العضو"))
        } catch (e: Exception) {
            Result.failure(Exception("خطأ في الاتصال: ${e.localizedMessage}"))
        }
    }

    suspend fun updateMember(id: String, data: Map<String, String>): Result<Member> {
        return try {
            val response = api.updateMember(id, data)
            if (response.isSuccessful) Result.success(response.body()!!)
            else Result.failure(Exception("فشل تحديث العضو"))
        } catch (e: Exception) {
            Result.failure(Exception("خطأ في الاتصال: ${e.localizedMessage}"))
        }
    }

    suspend fun deleteMember(id: String): Result<Boolean> {
        return try {
            val response = api.deleteMember(id)
            if (response.isSuccessful) Result.success(true)
            else Result.failure(Exception("فشل حذف العضو"))
        } catch (e: Exception) {
            Result.failure(Exception("خطأ في الاتصال: ${e.localizedMessage}"))
        }
    }

    // Tournaments
    suspend fun getTournaments(): Result<List<Tournament>> {
        return try {
            val response = api.getTournaments()
            if (response.isSuccessful) Result.success(response.body()!!)
            else Result.failure(Exception("فشل تحميل البطولات"))
        } catch (e: Exception) {
            Result.failure(Exception("خطأ في الاتصال: ${e.localizedMessage}"))
        }
    }

    suspend fun createTournament(data: Map<String, String>): Result<Tournament> {
        return try {
            val response = api.createTournament(data)
            if (response.isSuccessful) Result.success(response.body()!!)
            else Result.failure(Exception("فشل إنشاء البطولة"))
        } catch (e: Exception) {
            Result.failure(Exception("خطأ في الاتصال: ${e.localizedMessage}"))
        }
    }

    suspend fun updateTournament(id: String, data: Map<String, String>): Result<Tournament> {
        return try {
            val response = api.updateTournament(id, data)
            if (response.isSuccessful) Result.success(response.body()!!)
            else Result.failure(Exception("فشل تحديث البطولة"))
        } catch (e: Exception) {
            Result.failure(Exception("خطأ في الاتصال: ${e.localizedMessage}"))
        }
    }

    suspend fun deleteTournament(id: String): Result<Boolean> {
        return try {
            val response = api.deleteTournament(id)
            if (response.isSuccessful) Result.success(true)
            else Result.failure(Exception("فشل حذف البطولة"))
        } catch (e: Exception) {
            Result.failure(Exception("خطأ في الاتصال: ${e.localizedMessage}"))
        }
    }

    // Orders
    suspend fun getOrders(): Result<List<Order>> {
        return try {
            val response = api.getOrders()
            if (response.isSuccessful) Result.success(response.body()!!)
            else Result.failure(Exception("فشل تحميل الطلبات"))
        } catch (e: Exception) {
            Result.failure(Exception("خطأ في الاتصال: ${e.localizedMessage}"))
        }
    }

    suspend fun updateOrderStatus(id: String, status: String): Result<Order> {
        return try {
            val response = api.updateOrder(id, mapOf("status" to status))
            if (response.isSuccessful) Result.success(response.body()!!)
            else Result.failure(Exception("فشل تحديث الطلب"))
        } catch (e: Exception) {
            Result.failure(Exception("خطأ في الاتصال: ${e.localizedMessage}"))
        }
    }

    suspend fun deleteOrder(id: String): Result<Boolean> {
        return try {
            val response = api.deleteOrder(id)
            if (response.isSuccessful) Result.success(true)
            else Result.failure(Exception("فشل حذف الطلب"))
        } catch (e: Exception) {
            Result.failure(Exception("خطأ في الاتصال: ${e.localizedMessage}"))
        }
    }

    // Support
    suspend fun getSupportTickets(): Result<List<SupportTicket>> {
        return try {
            val response = api.getSupportTickets()
            if (response.isSuccessful) Result.success(response.body()!!)
            else Result.failure(Exception("فشل تحميل تذاكر الدعم"))
        } catch (e: Exception) {
            Result.failure(Exception("خطأ في الاتصال: ${e.localizedMessage}"))
        }
    }

    suspend fun updateSupportStatus(id: String, status: String): Result<SupportTicket> {
        return try {
            val response = api.updateSupportTicket(id, mapOf("status" to status))
            if (response.isSuccessful) Result.success(response.body()!!)
            else Result.failure(Exception("فشل تحديث التذكرة"))
        } catch (e: Exception) {
            Result.failure(Exception("خطأ في الاتصال: ${e.localizedMessage}"))
        }
    }

    suspend fun deleteSupportTicket(id: String): Result<Boolean> {
        return try {
            val response = api.deleteSupportTicket(id)
            if (response.isSuccessful) Result.success(true)
            else Result.failure(Exception("فشل حذف التذكرة"))
        } catch (e: Exception) {
            Result.failure(Exception("خطأ في الاتصال: ${e.localizedMessage}"))
        }
    }

    // Notifications
    suspend fun getNotifications(): Result<List<NotificationItem>> {
        return try {
            val response = api.getNotifications()
            if (response.isSuccessful) Result.success(response.body()!!)
            else Result.failure(Exception("فشل تحميل الإشعارات"))
        } catch (e: Exception) {
            Result.failure(Exception("خطأ في الاتصال: ${e.localizedMessage}"))
        }
    }

    suspend fun createNotification(data: Map<String, String>): Result<NotificationItem> {
        return try {
            val response = api.createNotification(data)
            if (response.isSuccessful) Result.success(response.body()!!)
            else Result.failure(Exception("فشل إنشاء الإشعار"))
        } catch (e: Exception) {
            Result.failure(Exception("خطأ في الاتصال: ${e.localizedMessage}"))
        }
    }

    suspend fun updateNotification(id: String, data: Map<String, String>): Result<NotificationItem> {
        return try {
            val response = api.updateNotification(id, data)
            if (response.isSuccessful) Result.success(response.body()!!)
            else Result.failure(Exception("فشل تحديث الإشعار"))
        } catch (e: Exception) {
            Result.failure(Exception("خطأ في الاتصال: ${e.localizedMessage}"))
        }
    }

    suspend fun deleteNotification(id: String): Result<Boolean> {
        return try {
            val response = api.deleteNotification(id)
            if (response.isSuccessful) Result.success(true)
            else Result.failure(Exception("فشل حذف الإشعار"))
        } catch (e: Exception) {
            Result.failure(Exception("خطأ في الاتصال: ${e.localizedMessage}"))
        }
    }
}
