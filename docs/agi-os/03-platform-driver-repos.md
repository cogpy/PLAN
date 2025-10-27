# Supporting Platform & Driver Repositories

These repositories provide extensions, hardware abstraction layers (HAL), and specialized services that bridge the kernel and cognitive framework layers with specific hardware, accelerators, and external systems.

## 🖥️ Platform Integration & Virtualization

### CogWSL
- **Language**: C++
- **Role**: Windows Subsystem integration — hypervisor / Stage 1 compatibility
- **Integration Priority**: 🟠 High
- **Key Features**:
  - WSL2 integration layer
  - Windows-Linux interoperability
  - Hypervisor compatibility
  - Cross-platform syscall translation
- **AGI-OS Role**: Windows platform support and virtualization
- **Dependencies**: coglux (kernel interface)
- **Use Cases**: Development on Windows, hybrid deployments

## 🧮 Compiler & Accelerator Support

### coglow
- **Language**: C++
- **Role**: Compiler for neural network accelerators — Neuromorphic HAL
- **Integration Priority**: 🟠 High
- **Key Features**:
  - Neural network graph compilation
  - Hardware-specific optimization
  - Accelerator backend targeting
  - Runtime code generation
- **AGI-OS Role**: Neuromorphic hardware abstraction layer
- **Dependencies**: echo-kern (compute interface), coggml
- **Supported Targets**: TPU, NPU, custom neuromorphic chips

## 💾 Vector Database & Persistence

### milvuscog
- **Language**: Go
- **Role**: Vector database — memory mapping / persistence service
- **Integration Priority**: 🟠 High
- **Key Features**:
  - High-dimensional vector storage
  - Similarity search (ANN/KNN)
  - Distributed storage backend
  - Real-time indexing
- **AGI-OS Role**: Persistent vector memory service
- **Dependencies**: mem0cog (memory layer)
- **Use Cases**: Semantic memory, embedding storage, retrieval

## 🎮 Graphics & Rendering Runtime

### CogRavEngine
- **Language**: C++
- **Role**: GPU/3D runtime — driver & scheduler testbed
- **Integration Priority**: 🟡 Development
- **Key Features**:
  - Real-time 3D rendering
  - GPU command scheduling
  - Graphics pipeline management
  - Physics simulation
- **AGI-OS Role**: GPU driver testing and validation
- **Dependencies**: coglux (device drivers)

### RavEngine
- **Language**: C++
- **Role**: Game engine and graphics framework
- **Integration Priority**: 🟡 Development
- **Key Features**:
  - Cross-platform graphics abstraction
  - Entity-component system
  - Scene graph management
- **AGI-OS Role**: Graphics subsystem reference
- **Dependencies**: CogRavEngine

## 🧠 Language Model Runtimes

### CogRWKV
- **Language**: Python / Rust
- **Role**: RNN LLM runtime — language runtime integration tests
- **Integration Priority**: 🟡 Supporting
- **Key Features**:
  - RWKV architecture implementation
  - Efficient RNN inference
  - Linear complexity attention
  - Streaming generation
- **AGI-OS Role**: RNN-based language model runtime
- **Dependencies**: occ, echo-kern (compute)

### rwkv.cog
- **Language**: Python / C++
- **Role**: Optimized RWKV implementation
- **Integration Priority**: 🟡 Supporting
- **Key Features**:
  - Kernel-optimized operations
  - Multi-backend support (CPU/GPU)
  - Memory-efficient inference
- **AGI-OS Role**: Production LLM runtime
- **Dependencies**: CogRWKV, coglow

### rwkv_ai00_cogserv
- **Language**: Rust
- **Role**: RWKV inference server
- **Integration Priority**: 🟡 Supporting
- **Key Features**:
  - HTTP API for inference
  - Concurrent request handling
  - Model management
  - Streaming responses
- **AGI-OS Role**: Language model serving layer
- **Dependencies**: rwkv.cog

## 🎨 User Interface & Integration SDKs

### unreal-mcp
- **Language**: C++
- **Role**: Unreal Engine integration — userland I/O & graphics integration
- **Integration Priority**: 🟢 Optional
- **Key Features**:
  - Unreal Engine plugin system
  - Model Context Protocol (MCP) bridge
  - Real-time communication
  - Visual scripting support
- **AGI-OS Role**: High-fidelity UI/graphics integration
- **Dependencies**: CogRavEngine (rendering), oc-agents-py

### ConvCogai-UnrealEngine-SDK
- **Language**: C++
- **Role**: Convex + Unreal integration SDK
- **Integration Priority**: 🟢 Optional
- **Key Features**:
  - Convex real-time sync
  - Unreal asset integration
  - Network replication
- **AGI-OS Role**: Real-time state synchronization
- **Dependencies**: unreal-mcp

## 🔌 Additional Platform Services

### Platform Service Matrix

| Repository | Hardware Support | Virtual | Persist | Graphics | Language |
|------------|------------------|---------|---------|----------|----------|
| **CogWSL** | ✅ x86_64 | ✅ | ❌ | ❌ | ❌ |
| **coglow** | ✅ Accelerators | ❌ | ❌ | ❌ | ⚠️ |
| **milvuscog** | ⚠️ | ⚠️ | ✅ | ❌ | ❌ |
| **CogRavEngine** | ✅ GPU | ❌ | ❌ | ✅ | ❌ |
| **CogRWKV** | ✅ CPU/GPU | ❌ | ⚠️ | ❌ | ✅ |
| **unreal-mcp** | ✅ GPU | ❌ | ❌ | ✅ | ⚠️ |

Legend: ✅ Full Support | ⚠️ Partial Support | ❌ Not Applicable

## 🏗️ Platform Architecture

```
┌─────────────────────────────────────────────────────┐
│            Cognitive Framework Layer                 │
│         (OCC, Agents, Memory Management)            │
└────────────────────┬────────────────────────────────┘
                     │
        ┌────────────┴────────────┐
        │   Platform Services     │
        └─────────────────────────┘
                     │
    ┌────────────────┼────────────────┐
    │                │                │
┌───▼────────┐  ┌───▼────────┐  ┌───▼────────┐
│  CogWSL    │  │  coglow    │  │ milvuscog  │
│ Hypervisor │  │ Accel HAL  │  │ Vector DB  │
└────────────┘  └────────────┘  └────────────┘
    │                │                │
    ├────────────────┼────────────────┤
    │                │                │
┌───▼────────┐  ┌───▼────────┐  ┌───▼────────┐
│ Graphics   │  │ Language   │  │ Interface  │
│ Engines    │  │ Runtimes   │  │ SDKs       │
└────────────┘  └────────────┘  └────────────┘
    │                │                │
    └────────────────┴────────────────┘
                     │
         ┌───────────▼───────────┐
         │   Kernel Layer        │
         │   (coglux/echo-kern)  │
         └───────────────────────┘
```

## 🎯 Integration Priorities

### Tier 1: Critical Platform Support
1. **coglow** - Neuromorphic accelerator compilation
2. **milvuscog** - Vector memory persistence
3. **CogWSL** - Cross-platform development

### Tier 2: Enhanced Capabilities
4. **CogRWKV** - Language model runtime
5. **CogRavEngine** - GPU driver validation
6. **rwkv.cog** - Production LLM inference

### Tier 3: Extended Integration
7. **unreal-mcp** - High-fidelity UI
8. **rwkv_ai00_cogserv** - Model serving
9. **ConvCogai-UnrealEngine-SDK** - Real-time sync

## 🔧 Driver Development

### Device Driver Interface (DDI)

Platform repositories implement the AGI-OS DDI for hardware integration:

```c
// Neuromorphic accelerator driver (coglow)
struct npu_driver {
    int (*compile)(struct npu_graph *graph);
    int (*execute)(struct npu_context *ctx);
    int (*query)(struct npu_info *info);
};

// Vector storage driver (milvuscog)
struct vecdb_driver {
    int (*insert)(struct vector *vec);
    int (*search)(struct vector *query, int k, struct result *res);
    int (*index)(struct index_params *params);
};

// Graphics driver (CogRavEngine)
struct gpu_driver {
    int (*submit)(struct command_buffer *cmds);
    int (*present)(struct framebuffer *fb);
    int (*sync)(struct fence *fence);
};
```

## 📊 Hardware Support Matrix

### Processor Architectures
- **x86_64**: Full support via coglux + CogWSL
- **ARM64**: Full support via coglux
- **RISC-V**: Experimental via coglux
- **Neuromorphic**: Via coglow HAL

### Accelerators
- **NVIDIA GPUs**: CUDA via coglow, CogRavEngine
- **AMD GPUs**: ROCm via coglow, CogRavEngine
- **Intel GPUs**: Level Zero via coglow
- **NPUs**: Custom via coglow HAL
- **TPUs**: Via coglow targeting

### Storage
- **Block Devices**: Standard kernel drivers
- **Vector Storage**: milvuscog integration
- **Hypergraph FS**: mem0cog overlay

## 🚀 Development Roadmap

### Phase 1: Core Platform (Q1)
- Deploy coglow accelerator HAL
- Integrate milvuscog vector database
- Enable CogWSL development platform

### Phase 2: Graphics & Compute (Q2)
- Integrate CogRavEngine GPU runtime
- Deploy RWKV language model support
- Enable multi-backend compute

### Phase 3: Advanced Integration (Q3)
- Deploy Unreal Engine integration
- Enable real-time graphics pipeline
- Optimize cross-platform performance

### Phase 4: Production Hardening (Q4)
- Production LLM serving infrastructure
- Multi-accelerator support
- Performance optimization

## 🔍 Performance Considerations

### Accelerator Latency
- **coglow compilation**: 100-1000ms (one-time)
- **NPU execution**: < 10ms per inference
- **Vector search (milvuscog)**: < 50ms for 1M vectors

### Memory Footprint
- **coglow runtime**: ~500MB
- **milvuscog index**: 1.5x data size
- **CogRavEngine**: 100-500MB GPU memory

### Throughput
- **NPU (coglow)**: 1000+ inferences/sec
- **Vector DB (milvuscog)**: 10K+ queries/sec
- **Graphics (CogRavEngine)**: 60+ FPS @ 1080p

## 📚 Additional Resources

- [Hardware Abstraction Layer Guide](./guides/hal-development.md)
- [Accelerator Compilation](./guides/accelerator-compilation.md)
- [Vector Database Integration](./guides/vector-db-integration.md)
- [Graphics Pipeline Architecture](./guides/graphics-pipeline.md)

## 🔗 Related Documentation

- [Core Kernel Repositories](./01-core-kernel-repos.md) - Kernel foundation
- [Cognitive Framework Layer](./02-cognitive-framework-layer.md) - Runtime components
- [5-Repo Bridge Set](./05-bridge-set-integration.md) - Integration patterns
