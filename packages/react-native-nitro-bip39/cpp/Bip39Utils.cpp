#include "Bip39Utils.hpp"
#include <cstring>
#include <iomanip>
#include <sstream>
#include <stdexcept>

namespace margelo::nitro::rnbip39
{

    uint8_t char2int(const char input)
    {
        if (input >= '0' && input <= '9')
            return input - '0';
        if (input >= 'A' && input <= 'F')
            return input - 'A' + 10;
        if (input >= 'a' && input <= 'f')
            return input - 'a' + 10;
        throw std::invalid_argument("Invalid input string");
    }

    std::vector<uint8_t> HexToBytes(const std::string hex)
    {
        if (hex.size() % 2 != 0)
        {
            throw std::invalid_argument("Invalid input string, length must be multiple of 2");
        }
        std::vector<uint8_t> ret;
        size_t start_at = 0;
        if (hex.rfind("0x", 0) == 0 || hex.rfind("0x", 0) == 0)
        {
            start_at = 2;
        }

        for (size_t i = start_at; i < hex.size(); i += 2)
        {
            ret.push_back(char2int(hex[i]) * 16 + char2int(hex[i + 1]));
        }
        return ret;
    }

    std::string HexStr(const std::vector<uint8_t> &data)
    {
        std::stringstream s;
        s << std::hex;
        for (size_t i = 0; i < data.size(); ++i)
            s << std::setw(2) << std::setfill('0') << static_cast<int>(data[i]);
        return s.str();
    }

    std::vector<uint8_t> ArrayBufferToVector(const jsi::ArrayBuffer &buffer, jsi::Runtime &runtime)
    {
        size_t size = buffer.size(runtime);
        uint8_t *dataPtr = buffer.data(runtime);
        std::vector<uint8_t> vec(dataPtr, dataPtr + size);
        return vec;
    }

} // namespace margelo::nitro::rnbip39