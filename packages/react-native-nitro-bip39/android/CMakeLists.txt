project(Bip39)
cmake_minimum_required(VERSION 3.9.0)

set (PACKAGE_NAME Bip39)
set (CMAKE_VERBOSE_MAKEFILE ON)
set (CMAKE_CXX_STANDARD 20)

# Define C++ library and add all sources
add_library(${PACKAGE_NAME} SHARED
        src/main/cpp/cpp-adapter.cpp
        ../bip39_cpp/src/bit_opts.cpp
        ../bip39_cpp/src/byteswap.cpp
        ../bip39_cpp/src/mnemonic.cpp
        ../bip39_cpp/src/random.cpp
        ../bip39_cpp/src/sha256.cpp
        ../bip39_cpp/src/toolbox.cpp
        ../bip39_cpp/src/langs.cpp
        ../cpp/HybridBip39.cpp
        ../cpp/Bip39Utils.cpp
)

# Add Nitrogen specs :)
include(${CMAKE_SOURCE_DIR}/../nitrogen/generated/android/Bip39+autolinking.cmake)

# Set up local includes
include_directories(
        "src/main/cpp"
        "../bip39_cpp/include"
        "../cpp"
)

find_library(LOG_LIB log)

find_package(openssl REQUIRED CONFIG)
find_package(utf8proc REQUIRED CONFIG)

# Link all libraries together
target_link_libraries(
        ${PACKAGE_NAME}
        ${LOG_LIB}
        android                                   # <-- Android core
        openssl::crypto
        openssl::ssl
        utf8proc::utf8proc
)
