#include "HybridBip39.hpp"
#include <NitroModules/NitroLogger.hpp>
#include <algorithm>
#include <random>
#include <sstream>
#include <iomanip>

#include "bit_opts.h"
#include "langs.h"
#include "mnemonic.h"
#include "random.h"
#include "toolbox.h"

#include "Bip39Utils.hpp"

namespace margelo::nitro::rnbip39
{

    WordLists HybridBip39::getDefaultWordlist()
    {
        return _defaultWordlist;
    }

    void HybridBip39::setDefaultWordlist(WordLists value)
    {
        _defaultWordlist = value;
    }

    std::string HybridBip39::wordListToString(WordLists wordlist)
    {
        switch (wordlist)
        {
        case WordLists::CHINESE_SIMPLIFIED:
            return "chinese_simplified";
        case WordLists::CHINESE_TRADITIONAL:
            return "chinese_traditional";
        case WordLists::CZECH:
            return "czech";
        case WordLists::ENGLISH:
            return "english";
        case WordLists::FRENCH:
            return "french";
        case WordLists::ITALIAN:
            return "italian";
        case WordLists::JAPANESE:
            return "japanese";
        case WordLists::KOREAN:
            return "korean";
        case WordLists::PORTUGUESE:
            return "portuguese";
        case WordLists::SPANISH:
            return "spanish";
        default:
            throw std::runtime_error("Invalid WordList");
        }
    }

    std::vector<uint8_t> HybridBip39::generateEntropy(int wordCount)
    {
        int bits_ent = bip39::Mnemonic::GetEntBitsByNumMnemonicSentences(wordCount);
        int num_bytes = bits_ent / 8;
        bip39::RandomBytes rnd(num_bytes);
        return rnd.Random();
    }

    std::string HybridBip39::generateMnemonic(std::optional<double> wordCount, const std::optional<std::shared_ptr<ArrayBuffer>> &rng, std::optional<WordLists> wordlist)
    {
        int actualWordCount = wordCount.value_or(12);
        std::vector<uint8_t> entropy;
        WordLists actualWordlist = wordlist.value_or(_defaultWordlist);

        if (rng)
        {
            auto buffer = *rng;
            entropy.resize(buffer->size());
            std::memcpy(entropy.data(), buffer->data(), buffer->size());
        }
        else
        {
            entropy = generateEntropy(actualWordCount);
        }

        std::string wordlistStr = wordListToString(actualWordlist);
        bip39::Mnemonic mnemonic(entropy);
        auto word_list = mnemonic.GetWordList(wordlistStr);
        return bip39::GenerateWords(word_list, bip39::GetDelimiterByLang(wordlistStr));
    }

    bool HybridBip39::validateMnemonic(const std::string &mnemonic, std::optional<WordLists> wordlist)
    {
        std::string wordlistStr = wordListToString(wordlist.value_or(_defaultWordlist));
        return bip39::Mnemonic::IsValidMnemonic(mnemonic, wordlistStr);
    }

    std::shared_ptr<ArrayBuffer> HybridBip39::mnemonicToSeed(const std::string &mnemonic, const std::optional<std::string> &password)
    {
        auto seed = bip39::Mnemonic::CreateSeedFromMnemonic(mnemonic, password.value_or(""));
        uint8_t *seedData = new uint8_t[seed.size()];
        std::memcpy(seedData, seed.data(), seed.size());
        return std::make_shared<NativeArrayBuffer>(seedData, seed.size(), [=]()
                                                   { delete[] seedData; });
    }

    std::string HybridBip39::mnemonicToSeedHex(const std::string &mnemonic, const std::optional<std::string> &password)
    {
        auto seed = bip39::Mnemonic::CreateSeedFromMnemonic(mnemonic, password.value_or(""));
        return HexStr(seed);
    }

    std::string HybridBip39::mnemonicToEntropy(const std::string &mnemonic, std::optional<WordLists> wordlist)
    {
        std::string wordlistStr = wordListToString(wordlist.value_or(_defaultWordlist));
        std::vector<std::string> word_list = bip39::ParseWords(mnemonic, bip39::GetDelimiterByLang(wordlistStr));
        bip39::Mnemonic mnemonicObj(word_list, wordlistStr);
        auto entropy = mnemonicObj.GetEntropyData();
        return HexStr(entropy);
    }

    std::string HybridBip39::entropyToMnemonic(const std::shared_ptr<ArrayBuffer> &entropy, std::optional<WordLists> wordlist)
    {
        std::vector<uint8_t> entropyVec(entropy->size());
        std::memcpy(entropyVec.data(), entropy->data(), entropy->size());

        // Validate entropy size
        if (entropyVec.empty() || entropyVec.size() > 32 || entropyVec.size() % 4 != 0)
        {
            throw std::runtime_error("Invalid entropy: size must be between 16 and 32 bytes and a multiple of 4");
        }

        std::string wordlistStr = wordListToString(wordlist.value_or(_defaultWordlist));
        bip39::Mnemonic mnemonic(entropyVec);
        auto word_list = mnemonic.GetWordList(wordlistStr);
        return bip39::GenerateWords(word_list, bip39::GetDelimiterByLang(wordlistStr));
    }

} // namespace margelo::nitro::rnbip39