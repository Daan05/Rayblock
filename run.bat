if exist build\ (
    cmake --build build && start build/Debug/Rayblock.exe
) else (
    md build
    cmake --build build && start build/Debug/Rayblock.exe
)
