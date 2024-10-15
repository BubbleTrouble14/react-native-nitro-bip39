#include "HybridBip39.hpp"
#include <NitroModules/NitroLogger.hpp>

namespace margelo::nitro::bip39
{

    WordLists HybridBip39::getDefaultWordlist()
    {
        return _defaultWordlist;
    }

    void HybridBip39::setDefaultWordlist(WordLists value)
    {
        _defaultWordlist = value;
    }

    std::string HybridBip39::generateMnemonic(std::optional<double> wordCount, const std::optional<std::shared_ptr<ArrayBuffer>> &rng, std::optional<WordLists> wordlist)
    {
        // Dummy implementation
        return "abandon ability able about above absent absorb abstract absurd abuse access accident";
    }

    bool HybridBip39::validateMnemonic(const std::string &mnemonic, std::optional<WordLists> wordlist)
    {
        // Dummy implementation
        return true;
    }

    std::shared_ptr<ArrayBuffer> HybridBip39::mnemonicToSeed(const std::string &mnemonic, const std::optional<std::string> &password)
    {
        // Dummy implementation
        uint8_t *dummyData = new uint8_t[64]{0}; // 64-byte dummy seed
        return std::make_shared<NativeArrayBuffer>(dummyData, 64, [=]()
                                                   { delete[] dummyData; });
    }

    std::string HybridBip39::mnemonicToSeedHex(const std::string &mnemonic, const std::optional<std::string> &password)
    {
        // Dummy implementation
        return "0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef";
    }

    std::string HybridBip39::mnemonicToEntropy(const std::string &mnemonic, std::optional<WordLists> wordlist)
    {
        // Dummy implementation
        return "0123456789abcdef0123456789abcdef";
    }

    std::string HybridBip39::entropyToMnemonic(const std::shared_ptr<ArrayBuffer> &entropy, std::optional<WordLists> wordlist)
    {
        // Dummy implementation
        size_t size = entropy->size();
        uint8_t *data = entropy->data();

        // Use the first few bytes to determine the mnemonic (dummy implementation)
        std::string result = "entropy from buffer: ";
        for (size_t i = 0; i < std::min(size, size_t(4)); ++i)
        {
            result += std::to_string(data[i]) + " ";
        }
        return result;
    }

} // namespace margelo::nitro::bip39