if exist build\ (
    cmake --build build --config Release && start build/Release/Rayblock.exe 
) else (
    cmake -B build
    cmake --build build --config Release && start build/Release/Rayblock.exe
)
