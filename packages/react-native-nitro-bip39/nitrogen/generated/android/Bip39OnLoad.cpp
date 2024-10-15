///
/// Bip39OnLoad.cpp
/// This file was generated by nitrogen. DO NOT MODIFY THIS FILE.
/// https://github.com/mrousavy/nitro
/// Copyright © 2024 Marc Rousavy @ Margelo
///

#include "Bip39OnLoad.hpp"

#include <jni.h>
#include <fbjni/fbjni.h>
#include <NitroModules/HybridObjectRegistry.hpp>

#include "HybridMath.hpp"

namespace margelo::nitro::bip39 {

int initialize(JavaVM* vm) {
  using namespace margelo::nitro;
  using namespace margelo::nitro::bip39;
  using namespace facebook;

  return facebook::jni::initialize(vm, [] {
    // Register native JNI methods
    

    // Register Nitro Hybrid Objects
    HybridObjectRegistry::registerHybridObjectConstructor(
      "Math",
      []() -> std::shared_ptr<HybridObject> {
        static_assert(std::is_default_constructible_v<HybridMath>,
                      "The HybridObject \"HybridMath\" is not default-constructible! "
                      "Create a public constructor that takes zero arguments to be able to autolink this HybridObject.");
        return std::make_shared<HybridMath>();
      }
    );
  });
}

} // namespace margelo::nitro::bip39
