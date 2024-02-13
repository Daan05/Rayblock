if exist build\ (
    cmake --build build --config Release && start build/Debug/Rayblock.exe 
) else (
    md build
    cmake --build build --config Release && start build/Debug/Rayblock.exe
)
