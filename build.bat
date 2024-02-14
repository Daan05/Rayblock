if exist build\ (
    cmake --build build --config Release && start build/Release/Rayblock.exe 
) else (
    md build
    cmake --build build --config Release && start build/Release/Rayblock.exe
)
