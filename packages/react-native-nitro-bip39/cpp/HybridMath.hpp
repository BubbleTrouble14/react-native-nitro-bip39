#pragma once

#include "HybridMathSpec.hpp"

namespace margelo::nitro::bip39
{

    using namespace facebook;

    class HybridMath : public virtual HybridMathSpec
    {
    public:
        HybridMath() : HybridObject(TAG) {}

    public:
        double add(double a, double b) override;
    };

}; // namespace margelo::nitro::bip39