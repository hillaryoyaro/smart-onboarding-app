# src/app/users/permissions.py
from rest_framework import permissions

class IsAdmin(permissions.BasePermission):
    """
    Allows access only to admin users.
    """
    def has_permission(self, request, view):
        return bool(request.user and request.user.is_staff)


class IsOwnerOrReadOnly(permissions.BasePermission):
    """
    Object-level permission to allow users to edit their own data only.
    Assumes the model instance has an 'id' or 'user' attribute.
    """
    def has_object_permission(self, request, view, obj):
        # Read permissions are allowed for any request
        if request.method in permissions.SAFE_METHODS:
            return True
        # Write permissions only for the owner
        return obj == request.user or getattr(obj, 'user', None) == request.user


class AllowRegisterAndLoginAny(permissions.BasePermission):
    """
    Allow unauthenticated users to access registration and login.
    """
    def has_permission(self, request, view):
        # Only allow unauthenticated users to POST for register/login
        if request.method == "POST":
            return True
        return bool(request.user and request.user.is_authenticated)
