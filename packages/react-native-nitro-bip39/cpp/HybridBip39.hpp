#pragma once

#include "HybridBip39Spec.hpp"

namespace margelo::nitro::bip39
{

    using namespace facebook;

    class HybridBip39 : public virtual HybridBip39Spec
    {
    public:
        HybridBip39() : HybridObject(TAG) {}

    public:
        WordLists getDefaultWordlist() override;
        void setDefaultWordlist(WordLists value) override;
        std::string generateMnemonic(std::optional<double> wordCount, const std::optional<std::shared_ptr<ArrayBuffer>> &rng, std::optional<WordLists> wordlist) override;
        bool validateMnemonic(const std::string &mnemonic, std::optional<WordLists> wordlist) override;
        std::shared_ptr<ArrayBuffer> mnemonicToSeed(const std::string &mnemonic, const std::optional<std::string> &password) override;
        std::string mnemonicToSeedHex(const std::string &mnemonic, const std::optional<std::string> &password) override;
        std::string mnemonicToEntropy(const std::string &mnemonic, std::optional<WordLists> wordlist) override;
        std::string entropyToMnemonic(const std::shared_ptr<ArrayBuffer> &entropy, std::optional<WordLists> wordlist) override;

    private:
        WordLists _defaultWordlist = WordLists::ENGLISH;
    };

} // namespace margelo::nitro::bip39