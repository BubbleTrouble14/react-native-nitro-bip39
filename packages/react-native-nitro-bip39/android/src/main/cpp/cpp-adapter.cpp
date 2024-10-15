#include <jni.h>
#include "Bip39OnLoad.hpp"

JNIEXPORT jint JNICALL JNI_OnLoad(JavaVM *vm, void *)
{
  return margelo::nitro::bip39::initialize(vm);
}
