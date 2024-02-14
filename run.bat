if exist build\ (
    cmake --build build && start build/Debug/Rayblock.exe
) else (
    cmake -B build
    cmake --build build && start build/Debug/Rayblock.exe
)
