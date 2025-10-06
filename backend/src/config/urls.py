from django.contrib import admin
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from app.form.views import FormViewSet
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

router = DefaultRouter()
router.register(r"forms", FormViewSet, basename="form")

urlpatterns = [
    path("admin/", admin.site.urls),
    path("api/", include(router.urls)),

    # Include your users app URLs
    path("api/auth/", include("app.users.urls")),  # 👈 This will include register/ and user/<int:pk>/
    
    # JWT token endpoints
    path("api/auth/token/", TokenObtainPairView.as_view(), name="token_obtain_pair"),
    path("api/auth/token/refresh/", TokenRefreshView.as_view(), name="token_refresh"),
]
