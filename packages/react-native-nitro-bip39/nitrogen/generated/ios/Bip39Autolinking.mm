///
/// Bip39Autolinking.mm
/// This file was generated by nitrogen. DO NOT MODIFY THIS FILE.
/// https://github.com/mrousavy/nitro
/// Copyright © 2024 Marc Rousavy @ Margelo
///

#import <Foundation/Foundation.h>
#import <NitroModules/HybridObjectRegistry.hpp>

#import <type_traits>

#include "HybridMath.hpp"
#include "HybridBip39.hpp"

@interface Bip39Autolinking : NSObject
@end

@implementation Bip39Autolinking

+ (void) load {
  using namespace margelo::nitro;
  using namespace margelo::nitro::rnbip39;

  HybridObjectRegistry::registerHybridObjectConstructor(
    "Math",
    []() -> std::shared_ptr<HybridObject> {
      static_assert(std::is_default_constructible_v<HybridMath>,
                    "The HybridObject \"HybridMath\" is not default-constructible! "
                    "Create a public constructor that takes zero arguments to be able to autolink this HybridObject.");
      return std::make_shared<HybridMath>();
    }
  );
  HybridObjectRegistry::registerHybridObjectConstructor(
    "Bip39",
    []() -> std::shared_ptr<HybridObject> {
      static_assert(std::is_default_constructible_v<HybridBip39>,
                    "The HybridObject \"HybridBip39\" is not default-constructible! "
                    "Create a public constructor that takes zero arguments to be able to autolink this HybridObject.");
      return std::make_shared<HybridBip39>();
    }
  );
}

@end
