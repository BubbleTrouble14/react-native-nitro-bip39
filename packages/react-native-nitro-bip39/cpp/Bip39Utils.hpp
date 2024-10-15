#pragma once

#include <jsi/jsi.h>
#include <string>
#include <vector>

namespace margelo::nitro::rnbip39
{

    namespace jsi = facebook::jsi;

    uint8_t char2int(const char input);
    std::vector<uint8_t> HexToBytes(const std::string hex);
    std::string HexStr(const std::vector<uint8_t> &data);
    std::vector<uint8_t> ArrayBufferToVector(const jsi::ArrayBuffer &buffer, jsi::Runtime &runtime);

} // namespace margelo::nitro::rnbip39