package com.syriafour.admin.data.model

import com.google.gson.annotations.SerializedName

data class LoginRequest(
    val email: String,
    val password: String
)

data class LoginResponse(
    val token: String,
    val user: User
)

data class User(
    val id: String = "",
    val name: String = "",
    val username: String = "",
    val email: String = "",
    val role: String = "",
    val status: String = "",
    val verified: Boolean = false,
    val avatar: String = "",
    val cover: String = "",
    val bio: String = "",
    val phone: String = "",
    val country: String = "",
    val age: String = "",
    val instagram: String = "",
    val discord: String = "",
    @SerializedName("ffUid") val ffUid: String = "",
    @SerializedName("ffIgn") val ffIgn: String = "",
    @SerializedName("ffServer") val ffServer: String = "",
    @SerializedName("ffLevel") val ffLevel: String = "",
    @SerializedName("ffRank") val ffRank: String = "",
    val weapon: String = "",
    val joinDate: String = "",
    val lastLogin: String = "",
    val createdAt: String = "",
    val updatedAt: String = ""
)

data class UsersResponse(
    val users: List<User>
)

data class UserUpdateRequest(
    val role: String? = null,
    val status: String? = null,
    val verified: Boolean? = null,
    val name: String? = null,
    val username: String? = null,
    val bio: String? = null,
    val country: String? = null,
    val avatar: String? = null,
    val cover: String? = null
)

data class ResetPasswordRequest(
    val newPassword: String
)

data class Member(
    val id: String = "",
    val name: String = "",
    val code: String = "",
    val age: String = "",
    val level: String = "",
    val gameId: String = "",
    val role: String = "",
    val country: String = "",
    val weapon: String = "",
    val wins: Int = 0,
    val rank: String = "",
    val bio: String = "",
    val joinDate: String = "",
    val prime: String = "",
    val instagram: String = "",
    val image: String = ""
)

data class Tournament(
    val id: String = "",
    val name: String = "",
    val type: String = "",
    val description: String = "",
    val date: String = "",
    val startDate: String = "",
    val endDate: String = "",
    val mode: String = "",
    val mapType: String = "",
    val prizeType: String = "",
    val prizeValue: String = "",
    val gold: String = "",
    val silver: String = "",
    val maxPlayers: String = "",
    val winners: String = "",
    val participants: List<Any> = emptyList()
)

data class Order(
    val id: String = "",
    val playerName: String = "",
    val playerId: String = "",
    val item: String = "",
    val payment: String = "",
    val status: String = "",
    val date: String = ""
)

data class SupportTicket(
    val id: String = "",
    val playerName: String = "",
    val type: String = "",
    val message: String = "",
    val status: String = "",
    val date: String = ""
)

data class NotificationItem(
    val id: String = "",
    val message: String = "",
    val type: String = "",
    val active: Boolean = false,
    val date: String = ""
)

data class AuditLog(
    val id: String = "",
    val userId: String = "",
    val action: String = "",
    val details: String = "",
    val createdAt: String = ""
)

data class AuditLogsResponse(
    val logs: List<AuditLog>
)

data class GenericResponse(
    val success: Boolean = false,
    val error: String? = null
)

data class SuccessResponse(
    val success: Boolean = false
)

data class MeResponse(
    val user: User
)

data class CreateRequest(
    val id: String = java.util.UUID.randomUUID().toString()
)
