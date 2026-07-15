package com.syriafour.admin.data.api

import com.syriafour.admin.data.model.*
import retrofit2.Response
import retrofit2.http.*

interface ApiService {

    // Auth
    @POST("auth/login")
    suspend fun login(@Body request: LoginRequest): Response<LoginResponse>

    @GET("auth/me")
    suspend fun getMe(): Response<MeResponse>

    // Admin - Users
    @GET("admin/users")
    suspend fun getUsers(): Response<UsersResponse>

    @PUT("admin/users/{id}")
    suspend fun updateUser(
        @Path("id") id: String,
        @Body body: UserUpdateRequest
    ): Response<UserUpdateResponse>

    @DELETE("admin/users/{id}")
    suspend fun deleteUser(@Path("id") id: String): Response<SuccessResponse>

    @POST("admin/users/{id}/reset-password")
    suspend fun resetPassword(
        @Path("id") id: String,
        @Body body: ResetPasswordRequest
    ): Response<SuccessResponse>

    // Admin - Audit Logs
    @GET("admin/audit-logs")
    suspend fun getAuditLogs(): Response<AuditLogsResponse>

    // CRUD - Members
    @GET("members")
    suspend fun getMembers(): Response<List<Member>>

    @POST("members")
    suspend fun createMember(@Body body: Map<String, String>): Response<Member>

    @PUT("members/{id}")
    suspend fun updateMember(
        @Path("id") id: String,
        @Body body: Map<String, String>
    ): Response<Member>

    @DELETE("members/{id}")
    suspend fun deleteMember(@Path("id") id: String): Response<SuccessResponse>

    // CRUD - Tournaments
    @GET("tournaments")
    suspend fun getTournaments(): Response<List<Tournament>>

    @POST("tournaments")
    suspend fun createTournament(@Body body: Map<String, String>): Response<Tournament>

    @PUT("tournaments/{id}")
    suspend fun updateTournament(
        @Path("id") id: String,
        @Body body: Map<String, String>
    ): Response<Tournament>

    @DELETE("tournaments/{id}")
    suspend fun deleteTournament(@Path("id") id: String): Response<SuccessResponse>

    // CRUD - Orders
    @GET("orders")
    suspend fun getOrders(): Response<List<Order>>

    @PUT("orders/{id}")
    suspend fun updateOrder(
        @Path("id") id: String,
        @Body body: Map<String, String>
    ): Response<Order>

    @DELETE("orders/{id}")
    suspend fun deleteOrder(@Path("id") id: String): Response<SuccessResponse>

    // CRUD - Support
    @GET("support")
    suspend fun getSupportTickets(): Response<List<SupportTicket>>

    @PUT("support/{id}")
    suspend fun updateSupportTicket(
        @Path("id") id: String,
        @Body body: Map<String, String>
    ): Response<SupportTicket>

    @DELETE("support/{id}")
    suspend fun deleteSupportTicket(@Path("id") id: String): Response<SuccessResponse>

    // CRUD - Notifications
    @GET("notifications")
    suspend fun getNotifications(): Response<List<NotificationItem>>

    @POST("notifications")
    suspend fun createNotification(@Body body: Map<String, String>): Response<NotificationItem>

    @PUT("notifications/{id}")
    suspend fun updateNotification(
        @Path("id") id: String,
        @Body body: Map<String, String>
    ): Response<NotificationItem>

    @DELETE("notifications/{id}")
    suspend fun deleteNotification(@Path("id") id: String): Response<SuccessResponse>
}

data class UserUpdateResponse(
    val user: User
)
