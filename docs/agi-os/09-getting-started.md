# Getting Started with AGI-OS Development

This guide helps you set up your development environment and start contributing to the AGI-OS kernel stack integration project.

## 🎯 Prerequisites

### Required Knowledge
- **Systems Programming**: C/C++ proficiency, understanding of OS concepts
- **Kernel Development**: Linux kernel basics, syscalls, memory management
- **Distributed Systems**: Network programming, IPC mechanisms
- **Python**: For cognitive framework components
- **Git**: Version control and collaboration

### Hardware Requirements

#### Minimum Specifications
- **CPU**: x86_64 or ARM64, 4+ cores
- **RAM**: 16GB minimum
- **Storage**: 100GB free space (SSD recommended)
- **Network**: Stable internet connection

#### Recommended Specifications
- **CPU**: x86_64 with 8+ cores (or ARM64)
- **RAM**: 32GB+ 
- **Storage**: 250GB+ NVMe SSD
- **GPU**: NVIDIA GPU for accelerator development (optional)
- **NPU**: Neuromorphic hardware for testing (optional)

### Software Requirements

#### Operating System
- **Primary**: Ubuntu 22.04 LTS or later
- **Alternative**: Debian 12+, Fedora 38+, or Arch Linux
- **Windows**: WSL2 with Ubuntu (for cross-platform development)
- **macOS**: Limited support (use Docker/VM)

#### Development Tools
```bash
# Essential tools
sudo apt-get update
sudo apt-get install -y \
    build-essential \
    gcc g++ \
    make cmake ninja-build \
    git \
    python3 python3-pip python3-venv \
    golang-go \
    rustc cargo \
    nodejs npm
```

## 🚀 Quick Start

### 1. Clone the Repository
```bash
# Clone PLAN (documentation) repository
git clone https://github.com/cogpy/PLAN.git
cd PLAN

# Clone core repositories
mkdir -p ~/cogpy
cd ~/cogpy

# Core kernel
git clone https://github.com/cogpy/coglux.git
git clone https://github.com/cogpy/echo-kern.git

# Cognitive framework
git clone https://github.com/cogpy/occ.git
git clone https://github.com/cogpy/oc-agents-py.git
git clone https://github.com/cogpy/mem0cog.git

# Supporting repos
git clone https://github.com/cogpy/kokkog.git
git clone https://github.com/cogpy/swarmcog.git
git clone https://github.com/cogpy/coglow.git
git clone https://github.com/cogpy/milvuscog.git
git clone https://github.com/cogpy/corg.git
```

### 2. Set Up Python Environment
```bash
# Create virtual environment
python3 -m venv ~/cogpy/venv
source ~/cogpy/venv/bin/activate

# Install common dependencies
pip install --upgrade pip setuptools wheel

# Install framework dependencies
cd ~/cogpy/occ
pip install -r requirements.txt

cd ~/cogpy/oc-agents-py
pip install -r requirements.txt

cd ~/cogpy/mem0cog
pip install -r requirements.txt
```

### 3. Build Core Kernel
```bash
cd ~/cogpy/coglux

# Configure kernel
make defconfig
make menuconfig  # Optional: customize configuration

# Build kernel
make -j$(nproc)

# Build modules
make modules -j$(nproc)
```

### 4. Build Echo.Kern
```bash
cd ~/cogpy/echo-kern

# Build C components
make

# Install Python bindings
pip install -e .

# Run tests
make test
```

### 5. Verify Installation
```bash
# Test Python components
cd ~/cogpy/occ
python -m pytest tests/

# Test kernel modules
cd ~/cogpy/coglux
make modules_check

# Test echo-kern integration
cd ~/cogpy/echo-kern
./scripts/integration_test.sh
```

## 🔧 Development Workflows

### Building Individual Components

#### Core Kernel (coglux)
```bash
cd ~/cogpy/coglux

# Clean build
make clean
make -j$(nproc)

# Install modules (requires root)
sudo make modules_install
sudo make install

# Generate compile_commands.json for IDE
bear -- make -j$(nproc)
```

#### Echo.Kern
```bash
cd ~/cogpy/echo-kern

# Build with debug symbols
make DEBUG=1

# Build with verbose output
make V=1

# Build specific target
make dtesn_core
```

#### Cognitive Framework
```bash
cd ~/cogpy/occ

# Development install
pip install -e ".[dev]"

# Run type checking
mypy src/

# Run linter
ruff check src/

# Format code
black src/
```

#### kokkog Scheduler
```bash
cd ~/cogpy/kokkog

# Configure
mkdir build && cd build
cmake .. -DCMAKE_BUILD_TYPE=Debug

# Build
make -j$(nproc)

# Run tests
ctest --verbose
```

### Testing

#### Unit Tests
```bash
# Python components
cd ~/cogpy/occ
python -m pytest tests/ -v

# C/C++ components
cd ~/cogpy/echo-kern
make test

# Rust components (if applicable)
cd ~/cogpy/cogdex
cargo test
```

#### Integration Tests
```bash
# Full stack integration test
cd ~/cogpy/echo-kern
./scripts/integration_test.sh --full

# Specific subsystem
./scripts/integration_test.sh --subsystem memory

# Performance benchmarks
./scripts/benchmark.sh
```

#### System Tests
```bash
# Boot test in QEMU
cd ~/cogpy/coglux
./scripts/test_boot.sh

# Multi-node test
cd ~/cogpy/swarmcog
./scripts/test_cluster.sh --nodes 3
```

## 🐛 Debugging

### Kernel Debugging with QEMU
```bash
cd ~/cogpy/coglux

# Start QEMU with debug symbols
./scripts/run_qemu.sh --debug

# In another terminal, attach GDB
gdb vmlinux
(gdb) target remote localhost:1234
(gdb) b start_kernel
(gdb) c
```

### Python Debugging
```python
# Add to code for interactive debugging
import pdb; pdb.set_trace()

# Or use IPython
import IPython; IPython.embed()
```

### Logging and Tracing
```bash
# Enable kernel debug logs
echo 8 > /proc/sys/kernel/printk

# Trace echo-kern events
cd ~/cogpy/echo-kern
./scripts/trace.sh --events dtesn,memory,schedule

# Monitor agent activity
cd ~/cogpy/oc-agents-py
python -m occ.tools.monitor
```

## 📝 Coding Standards

### C/C++ Style Guide
- Follow Linux kernel coding style for kernel code
- Use clang-format for C++ components
- Maximum line length: 100 characters
- Use snake_case for functions and variables
- Document all public APIs

### Python Style Guide
- Follow PEP 8
- Use type hints for all functions
- Use docstrings (Google style)
- Maximum line length: 100 characters
- Use black for formatting
- Use ruff for linting

### Commit Message Format
```
<type>(<scope>): <subject>

<body>

<footer>
```

**Types**: feat, fix, docs, style, refactor, test, chore

**Example**:
```
feat(echo-kern): add DTESN reservoir allocation

Implement efficient memory allocation for DTESN reservoirs
using a buddy allocator with NUMA awareness.

Closes #123
```

## 🤝 Contributing

### Contribution Workflow

1. **Fork the repository**
   ```bash
   # On GitHub, click "Fork" button
   git clone https://github.com/YOUR_USERNAME/REPO_NAME.git
   ```

2. **Create a feature branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```

3. **Make your changes**
   - Write code following style guides
   - Add tests for new functionality
   - Update documentation

4. **Commit your changes**
   ```bash
   git add .
   git commit -m "feat: your feature description"
   ```

5. **Push to your fork**
   ```bash
   git push origin feature/your-feature-name
   ```

6. **Open a Pull Request**
   - Go to GitHub and click "New Pull Request"
   - Fill out the PR template
   - Link related issues

### Code Review Process

1. **Automated Checks**: CI runs tests, linters, and build checks
2. **Peer Review**: At least one maintainer reviews code
3. **Testing**: Verify changes in test environment
4. **Documentation**: Ensure docs are updated
5. **Merge**: Maintainer merges after approval

## 🔬 Working on Specific Components

### Kernel Development

#### Adding a New Syscall
```c
// In coglux/kernel/agi_os/syscalls.c
SYSCALL_DEFINE2(cognitive_alloc, size_t, size, int, flags)
{
    struct cognitive_resource *res;
    
    res = echo_kern_alloc_resource(size, flags);
    if (!res)
        return -ENOMEM;
    
    return register_resource(current, res);
}
```

#### Implementing a DTESN Operation
```c
// In echo-kern/src/dtesn/operations.c
int dtesn_compute_reservoir(
    struct reservoir_context *ctx,
    const float *input,
    float *output)
{
    // Implementation
    return 0;
}
```

### Framework Development

#### Creating a New Agent Type
```python
# In oc-agents-py/src/occ/agents/custom_agent.py
from occ.agents.base import BaseAgent

class CustomAgent(BaseAgent):
    def __init__(self, config):
        super().__init__(config)
        # Initialize agent-specific resources
    
    def process(self, task):
        # Implement agent logic
        return result
```

#### Adding a Memory Operation
```python
# In mem0cog/src/mem0cog/operations.py
def store_semantic_memory(
    graph: HypergraphFS,
    data: Any,
    relations: List[Relation]
) -> NodeID:
    """Store data with semantic relationships."""
    node = graph.allocate_node(data)
    for rel in relations:
        graph.create_edge(node, rel.target, rel.type)
    return node
```

## 📊 Performance Profiling

### Kernel Profiling
```bash
# Use perf for CPU profiling
cd ~/cogpy/coglux
perf record -g ./test_program
perf report

# Trace memory allocations
./scripts/trace_allocations.sh
```

### Python Profiling
```python
# Use cProfile
python -m cProfile -o profile.stats your_script.py

# Analyze with snakeviz
snakeviz profile.stats
```

## 🧪 Setting Up Test Environment

### Local Test Cluster
```bash
# Start 3-node cluster
cd ~/cogpy/swarmcog
./scripts/start_cluster.sh --nodes 3 --debug

# Run distributed tests
python tests/test_distributed.py

# Stop cluster
./scripts/stop_cluster.sh
```

### Docker Development Environment
```bash
# Build development container
cd ~/cogpy/PLAN/docker
docker build -t agi-os-dev .

# Run container
docker run -it --privileged \
    -v ~/cogpy:/workspace \
    agi-os-dev /bin/bash
```

## 📚 Additional Resources

### Documentation
- [Architecture Overview](./README.md)
- [Core Kernel Guide](./01-core-kernel-repos.md)
- [Framework Guide](./02-cognitive-framework-layer.md)
- [Integration Guide](./05-bridge-set-integration.md)

### Community
- **GitHub Discussions**: Ask questions and share ideas
- **Discord**: Real-time chat (link in main README)
- **Mailing List**: Development announcements
- **Wiki**: Community-maintained documentation

### Learning Resources
- Linux Kernel Development (book by Robert Love)
- "Understanding the Linux Kernel" (Bovet & Cesati)
- Echo State Networks papers
- DTESN mathematical foundations

## 🆘 Getting Help

### Troubleshooting

#### Build Failures
```bash
# Clean and rebuild
make clean
make distclean
./configure
make -j$(nproc)
```

#### Import Errors
```bash
# Reinstall in development mode
pip install -e . --force-reinstall
```

#### Permission Errors
```bash
# Ensure correct ownership
sudo chown -R $USER:$USER ~/cogpy
```

### Support Channels

1. **GitHub Issues**: Bug reports and feature requests
2. **Discussions**: General questions and help
3. **Stack Overflow**: Tag with `agi-os` or `cogpy`
4. **Email**: dev@cogpy.org (for sensitive issues)

## 🎓 Next Steps

### For New Contributors
1. Complete the quick start guide above
2. Read the [Architecture Overview](./README.md)
3. Browse open issues labeled `good-first-issue`
4. Join the community channels
5. Make your first contribution!

### For Core Development
1. Review the [Integration Roadmap](./08-integration-roadmap.md)
2. Study the [5-Repo Bridge Set](./05-bridge-set-integration.md)
3. Set up full development environment
4. Join weekly development meetings
5. Pick a milestone to contribute to

## 🔗 Related Documentation

- [Repository Inventory](./07-repository-inventory.md) - Complete repository list
- [Integration Roadmap](./08-integration-roadmap.md) - Project timeline
- [Visual Dependency Graph](./06-dependency-graph.md) - System architecture
