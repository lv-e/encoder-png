	.section	__TEXT,__text,regular,pure_instructions
	.build_version macos, 10, 15	sdk_version 10, 15, 6
	.globl	_main                   ## -- Begin function main
	.p2align	4, 0x90
_main:                                  ## @main
Lfunc_begin0:
	.cfi_startproc
	.cfi_personality 155, ___gxx_personality_v0
	.cfi_lsda 16, Lexception0
## %bb.0:
	pushq	%rbp
	.cfi_def_cfa_offset 16
	.cfi_offset %rbp, -16
	movq	%rsp, %rbp
	.cfi_def_cfa_register %rbp
	subq	$48, %rsp
	movl	$16, %edi
	callq	__Znwm
	movq	%rax, %rcx
	movq	%rax, %rdx
Ltmp0:
	leaq	__ZL5image(%rip), %rsi
	movq	%rax, %rdi
	movq	%rcx, -32(%rbp)         ## 8-byte Spill
	movq	%rdx, -40(%rbp)         ## 8-byte Spill
	callq	__ZN5Prips4FileC1EPKh
Ltmp1:
	jmp	LBB0_1
LBB0_1:
	movq	-40(%rbp), %rax         ## 8-byte Reload
	movq	%rax, -8(%rbp)
	movq	-8(%rbp), %rcx
	movzwl	2(%rcx), %esi
	leaq	L_.str(%rip), %rdi
	movb	$0, %al
	callq	_printf
	movq	-8(%rbp), %rcx
	movzwl	4(%rcx), %esi
	leaq	L_.str.1(%rip), %rdi
	movl	%eax, -44(%rbp)         ## 4-byte Spill
	movb	$0, %al
	callq	_printf
	xorl	%esi, %esi
	movq	-8(%rbp), %rdi
	movl	%eax, -48(%rbp)         ## 4-byte Spill
	callq	__ZN5Prips4File13drawBitPlanesEt
	xorl	%eax, %eax
	addq	$48, %rsp
	popq	%rbp
	retq
LBB0_2:
Ltmp2:
                                        ## kill: def $edx killed $edx killed $rdx
	movq	%rax, -16(%rbp)
	movl	%edx, -20(%rbp)
	movq	-32(%rbp), %rdi         ## 8-byte Reload
	callq	__ZdlPv
## %bb.3:
	movq	-16(%rbp), %rdi
	callq	__Unwind_Resume
	ud2
Lfunc_end0:
	.cfi_endproc
	.section	__TEXT,__gcc_except_tab
	.p2align	2
GCC_except_table0:
Lexception0:
	.byte	255                     ## @LPStart Encoding = omit
	.byte	255                     ## @TType Encoding = omit
	.byte	1                       ## Call site Encoding = uleb128
	.uleb128 Lcst_end0-Lcst_begin0
Lcst_begin0:
	.uleb128 Lfunc_begin0-Lfunc_begin0 ## >> Call Site 1 <<
	.uleb128 Ltmp0-Lfunc_begin0     ##   Call between Lfunc_begin0 and Ltmp0
	.byte	0                       ##     has no landing pad
	.byte	0                       ##   On action: cleanup
	.uleb128 Ltmp0-Lfunc_begin0     ## >> Call Site 2 <<
	.uleb128 Ltmp1-Ltmp0            ##   Call between Ltmp0 and Ltmp1
	.uleb128 Ltmp2-Lfunc_begin0     ##     jumps to Ltmp2
	.byte	0                       ##   On action: cleanup
	.uleb128 Ltmp1-Lfunc_begin0     ## >> Call Site 3 <<
	.uleb128 Lfunc_end0-Ltmp1       ##   Call between Ltmp1 and Lfunc_end0
	.byte	0                       ##     has no landing pad
	.byte	0                       ##   On action: cleanup
Lcst_end0:
	.p2align	2
                                        ## -- End function
	.section	__TEXT,__text,regular,pure_instructions
	.globl	__ZN5Prips4FileC1EPKh   ## -- Begin function _ZN5Prips4FileC1EPKh
	.weak_def_can_be_hidden	__ZN5Prips4FileC1EPKh
	.p2align	4, 0x90
__ZN5Prips4FileC1EPKh:                  ## @_ZN5Prips4FileC1EPKh
	.cfi_startproc
## %bb.0:
	pushq	%rbp
	.cfi_def_cfa_offset 16
	.cfi_offset %rbp, -16
	movq	%rsp, %rbp
	.cfi_def_cfa_register %rbp
	subq	$16, %rsp
	movq	%rdi, -8(%rbp)
	movq	%rsi, -16(%rbp)
	movq	-8(%rbp), %rdi
	movq	-16(%rbp), %rsi
	callq	__ZN5Prips4FileC2EPKh
	addq	$16, %rsp
	popq	%rbp
	retq
	.cfi_endproc
                                        ## -- End function
	.globl	__ZN5Prips4File13drawBitPlanesEt ## -- Begin function _ZN5Prips4File13drawBitPlanesEt
	.weak_definition	__ZN5Prips4File13drawBitPlanesEt
	.p2align	4, 0x90
__ZN5Prips4File13drawBitPlanesEt:       ## @_ZN5Prips4File13drawBitPlanesEt
Lfunc_begin1:
	.cfi_startproc
	.cfi_personality 155, ___gxx_personality_v0
	.cfi_lsda 16, Lexception1
## %bb.0:
	pushq	%rbp
	.cfi_def_cfa_offset 16
	.cfi_offset %rbp, -16
	movq	%rsp, %rbp
	.cfi_def_cfa_register %rbp
	subq	$80, %rsp
                                        ## kill: def $si killed $si killed $esi
	movq	%rdi, -8(%rbp)
	movw	%si, -10(%rbp)
	movq	-8(%rbp), %rax
	cmpb	$0, 1(%rax)
	movq	%rax, -56(%rbp)         ## 8-byte Spill
	jne	LBB2_2
## %bb.1:
	jmp	LBB2_13
LBB2_2:
	movl	$40, %edi
	callq	__Znwm
	movq	%rax, %rcx
Ltmp3:
	movq	-56(%rbp), %rdi         ## 8-byte Reload
	movq	%rcx, -64(%rbp)         ## 8-byte Spill
	movq	%rax, -72(%rbp)         ## 8-byte Spill
	callq	__ZN5Prips4File11planesStartEv
Ltmp4:
	movl	%eax, -76(%rbp)         ## 4-byte Spill
	jmp	LBB2_3
LBB2_3:
	movq	-56(%rbp), %rax         ## 8-byte Reload
	movq	8(%rax), %rdx
Ltmp5:
	movq	-72(%rbp), %rdi         ## 8-byte Reload
	movl	-76(%rbp), %esi         ## 4-byte Reload
	callq	__ZN5Prips12PlanesWalkerC1EjPKh
Ltmp6:
	jmp	LBB2_4
LBB2_4:
	movq	-72(%rbp), %rax         ## 8-byte Reload
	movq	%rax, -24(%rbp)
	movl	$0, -40(%rbp)
LBB2_5:                                 ## =>This Loop Header: Depth=1
                                        ##     Child Loop BB2_7 Depth 2
	movl	-40(%rbp), %eax
	movq	-56(%rbp), %rcx         ## 8-byte Reload
	movzwl	4(%rcx), %edx
	cmpl	%edx, %eax
	jge	LBB2_13
## %bb.6:                               ##   in Loop: Header=BB2_5 Depth=1
	movl	$0, -44(%rbp)
LBB2_7:                                 ##   Parent Loop BB2_5 Depth=1
                                        ## =>  This Inner Loop Header: Depth=2
	movl	-44(%rbp), %eax
	movq	-56(%rbp), %rcx         ## 8-byte Reload
	movzwl	2(%rcx), %edx
	cmpl	%edx, %eax
	jge	LBB2_11
## %bb.8:                               ##   in Loop: Header=BB2_7 Depth=2
	movq	-24(%rbp), %rdi
	callq	__ZN5Prips12PlanesWalker14nextPixelColorEv
	leaq	L_.str.2(%rip), %rdi
	movl	%eax, %esi
	movb	$0, %al
	callq	_printf
## %bb.9:                               ##   in Loop: Header=BB2_7 Depth=2
	movl	-44(%rbp), %eax
	addl	$1, %eax
	movl	%eax, -44(%rbp)
	jmp	LBB2_7
LBB2_10:
Ltmp7:
                                        ## kill: def $edx killed $edx killed $rdx
	movq	%rax, -32(%rbp)
	movl	%edx, -36(%rbp)
	movq	-64(%rbp), %rdi         ## 8-byte Reload
	callq	__ZdlPv
	jmp	LBB2_14
LBB2_11:                                ##   in Loop: Header=BB2_5 Depth=1
	leaq	L_.str.3(%rip), %rdi
	movb	$0, %al
	callq	_printf
## %bb.12:                              ##   in Loop: Header=BB2_5 Depth=1
	movl	-40(%rbp), %eax
	addl	$1, %eax
	movl	%eax, -40(%rbp)
	jmp	LBB2_5
LBB2_13:
	addq	$80, %rsp
	popq	%rbp
	retq
LBB2_14:
	movq	-32(%rbp), %rdi
	callq	__Unwind_Resume
	ud2
Lfunc_end1:
	.cfi_endproc
	.section	__TEXT,__gcc_except_tab
	.p2align	2
GCC_except_table2:
Lexception1:
	.byte	255                     ## @LPStart Encoding = omit
	.byte	255                     ## @TType Encoding = omit
	.byte	1                       ## Call site Encoding = uleb128
	.uleb128 Lcst_end1-Lcst_begin1
Lcst_begin1:
	.uleb128 Lfunc_begin1-Lfunc_begin1 ## >> Call Site 1 <<
	.uleb128 Ltmp3-Lfunc_begin1     ##   Call between Lfunc_begin1 and Ltmp3
	.byte	0                       ##     has no landing pad
	.byte	0                       ##   On action: cleanup
	.uleb128 Ltmp3-Lfunc_begin1     ## >> Call Site 2 <<
	.uleb128 Ltmp6-Ltmp3            ##   Call between Ltmp3 and Ltmp6
	.uleb128 Ltmp7-Lfunc_begin1     ##     jumps to Ltmp7
	.byte	0                       ##   On action: cleanup
	.uleb128 Ltmp6-Lfunc_begin1     ## >> Call Site 3 <<
	.uleb128 Lfunc_end1-Ltmp6       ##   Call between Ltmp6 and Lfunc_end1
	.byte	0                       ##     has no landing pad
	.byte	0                       ##   On action: cleanup
Lcst_end1:
	.p2align	2
                                        ## -- End function
	.section	__TEXT,__text,regular,pure_instructions
	.globl	__ZN5Prips4FileC2EPKh   ## -- Begin function _ZN5Prips4FileC2EPKh
	.weak_def_can_be_hidden	__ZN5Prips4FileC2EPKh
	.p2align	4, 0x90
__ZN5Prips4FileC2EPKh:                  ## @_ZN5Prips4FileC2EPKh
	.cfi_startproc
## %bb.0:
	pushq	%rbp
	.cfi_def_cfa_offset 16
	.cfi_offset %rbp, -16
	movq	%rsp, %rbp
	.cfi_def_cfa_register %rbp
	subq	$48, %rsp
	xorl	%eax, %eax
                                        ## kill: def $al killed $al killed $eax
	movq	%rdi, -8(%rbp)
	movq	%rsi, -16(%rbp)
	movq	-8(%rbp), %rcx
	movq	-16(%rbp), %rdx
	movq	%rdx, 8(%rcx)
	movq	8(%rcx), %rdx
	movb	(%rdx), %r8b
	movb	%r8b, -17(%rbp)
	movq	8(%rcx), %rdx
	movb	1(%rdx), %r8b
	movb	%r8b, -18(%rbp)
	movzbl	-17(%rbp), %r9d
	andl	$248, %r9d
	sarl	$3, %r9d
	cmpl	$12, %r9d
	sete	%r8b
	andb	$1, %r8b
	movb	%r8b, 1(%rcx)
	cmpb	$0, 1(%rcx)
	movq	%rcx, -32(%rbp)         ## 8-byte Spill
	movb	%al, -33(%rbp)          ## 1-byte Spill
	je	LBB3_2
## %bb.1:
	movzbl	-18(%rbp), %eax
	andl	$192, %eax
	sarl	$6, %eax
	cmpl	$1, %eax
	sete	%cl
	movb	%cl, -33(%rbp)          ## 1-byte Spill
LBB3_2:
	movb	-33(%rbp), %al          ## 1-byte Reload
	andb	$1, %al
	movq	-32(%rbp), %rcx         ## 8-byte Reload
	movb	%al, 1(%rcx)
	cmpb	$0, 1(%rcx)
	jne	LBB3_4
## %bb.3:
	jmp	LBB3_5
LBB3_4:
	movb	-17(%rbp), %al
	andb	$7, %al
	movq	-32(%rbp), %rcx         ## 8-byte Reload
	movb	%al, (%rcx)
	movzbl	-18(%rbp), %edx
	andl	$56, %edx
	shrl	$3, %edx
	addl	$2, %edx
	movl	$2, %esi
	movl	%esi, %edi
	movl	%esi, -40(%rbp)         ## 4-byte Spill
	movl	%edx, %esi
	callq	__ZL3powIiiENSt3__116__lazy_enable_ifIXaasr3std13is_arithmeticIT_EE5valuesr3std13is_arithmeticIT0_EE5valueENS0_9__promoteIS2_S3_vEEE4typeES2_S3_
	cvttsd2si	%xmm0, %edx
                                        ## kill: def $dx killed $dx killed $edx
	movq	-32(%rbp), %rcx         ## 8-byte Reload
	movw	%dx, 2(%rcx)
	movzbl	-18(%rbp), %esi
	andl	$7, %esi
	addl	$2, %esi
	movl	-40(%rbp), %edi         ## 4-byte Reload
	callq	__ZL3powIiiENSt3__116__lazy_enable_ifIXaasr3std13is_arithmeticIT_EE5valuesr3std13is_arithmeticIT0_EE5valueENS0_9__promoteIS2_S3_vEEE4typeES2_S3_
	cvttsd2si	%xmm0, %esi
                                        ## kill: def $si killed $si killed $esi
	movq	-32(%rbp), %rcx         ## 8-byte Reload
	movw	%si, 4(%rcx)
LBB3_5:
	addq	$48, %rsp
	popq	%rbp
	retq
	.cfi_endproc
                                        ## -- End function
	.p2align	4, 0x90         ## -- Begin function _ZL3powIiiENSt3__116__lazy_enable_ifIXaasr3std13is_arithmeticIT_EE5valuesr3std13is_arithmeticIT0_EE5valueENS0_9__promoteIS2_S3_vEEE4typeES2_S3_
__ZL3powIiiENSt3__116__lazy_enable_ifIXaasr3std13is_arithmeticIT_EE5valuesr3std13is_arithmeticIT0_EE5valueENS0_9__promoteIS2_S3_vEEE4typeES2_S3_: ## @_ZL3powIiiENSt3__116__lazy_enable_ifIXaasr3std13is_arithmeticIT_EE5valuesr3std13is_arithmeticIT0_EE5valueENS0_9__promoteIS2_S3_vEEE4typeES2_S3_
	.cfi_startproc
## %bb.0:
	pushq	%rbp
	.cfi_def_cfa_offset 16
	.cfi_offset %rbp, -16
	movq	%rsp, %rbp
	.cfi_def_cfa_register %rbp
	subq	$16, %rsp
	movl	%edi, -4(%rbp)
	movl	%esi, -8(%rbp)
	cvtsi2sdl	-4(%rbp), %xmm0
	cvtsi2sdl	-8(%rbp), %xmm1
	callq	_pow
	addq	$16, %rsp
	popq	%rbp
	retq
	.cfi_endproc
                                        ## -- End function
	.globl	__ZN5Prips4File11planesStartEv ## -- Begin function _ZN5Prips4File11planesStartEv
	.weak_definition	__ZN5Prips4File11planesStartEv
	.p2align	4, 0x90
__ZN5Prips4File11planesStartEv:         ## @_ZN5Prips4File11planesStartEv
	.cfi_startproc
## %bb.0:
	pushq	%rbp
	.cfi_def_cfa_offset 16
	.cfi_offset %rbp, -16
	movq	%rsp, %rbp
	.cfi_def_cfa_register %rbp
	movq	%rdi, -8(%rbp)
	movq	-8(%rbp), %rax
	movzbl	(%rax), %ecx
	shll	$1, %ecx
	addl	$2, %ecx
	movl	%ecx, %eax
	popq	%rbp
	retq
	.cfi_endproc
                                        ## -- End function
	.globl	__ZN5Prips12PlanesWalkerC1EjPKh ## -- Begin function _ZN5Prips12PlanesWalkerC1EjPKh
	.weak_def_can_be_hidden	__ZN5Prips12PlanesWalkerC1EjPKh
	.p2align	4, 0x90
__ZN5Prips12PlanesWalkerC1EjPKh:        ## @_ZN5Prips12PlanesWalkerC1EjPKh
	.cfi_startproc
## %bb.0:
	pushq	%rbp
	.cfi_def_cfa_offset 16
	.cfi_offset %rbp, -16
	movq	%rsp, %rbp
	.cfi_def_cfa_register %rbp
	subq	$32, %rsp
	movq	%rdi, -8(%rbp)
	movl	%esi, -12(%rbp)
	movq	%rdx, -24(%rbp)
	movq	-8(%rbp), %rdi
	movl	-12(%rbp), %esi
	movq	-24(%rbp), %rdx
	callq	__ZN5Prips12PlanesWalkerC2EjPKh
	addq	$32, %rsp
	popq	%rbp
	retq
	.cfi_endproc
                                        ## -- End function
	.globl	__ZN5Prips12PlanesWalker14nextPixelColorEv ## -- Begin function _ZN5Prips12PlanesWalker14nextPixelColorEv
	.weak_definition	__ZN5Prips12PlanesWalker14nextPixelColorEv
	.p2align	4, 0x90
__ZN5Prips12PlanesWalker14nextPixelColorEv: ## @_ZN5Prips12PlanesWalker14nextPixelColorEv
	.cfi_startproc
## %bb.0:
	pushq	%rbp
	.cfi_def_cfa_offset 16
	.cfi_offset %rbp, -16
	movq	%rsp, %rbp
	.cfi_def_cfa_register %rbp
	subq	$16, %rsp
	movq	%rdi, -8(%rbp)
	movq	-8(%rbp), %rax
	movl	28(%rax), %ecx
	addl	$-1, %ecx
	movl	%ecx, 28(%rax)
	cmpl	$0, %ecx
	movq	%rax, -16(%rbp)         ## 8-byte Spill
	jne	LBB7_2
## %bb.1:
	movq	-16(%rbp), %rdi         ## 8-byte Reload
	callq	__ZN5Prips12PlanesWalker7advanceEv
	movq	-16(%rbp), %rcx         ## 8-byte Reload
	movl	%eax, 28(%rcx)
	cmpl	$0, 32(%rcx)
	setne	%dl
	xorb	$-1, %dl
	andb	$1, %dl
	movzbl	%dl, %eax
	movl	%eax, 32(%rcx)
LBB7_2:
	movq	-16(%rbp), %rax         ## 8-byte Reload
	movl	32(%rax), %ecx
	movl	%ecx, %eax
	addq	$16, %rsp
	popq	%rbp
	retq
	.cfi_endproc
                                        ## -- End function
	.globl	__ZN5Prips12PlanesWalkerC2EjPKh ## -- Begin function _ZN5Prips12PlanesWalkerC2EjPKh
	.weak_def_can_be_hidden	__ZN5Prips12PlanesWalkerC2EjPKh
	.p2align	4, 0x90
__ZN5Prips12PlanesWalkerC2EjPKh:        ## @_ZN5Prips12PlanesWalkerC2EjPKh
	.cfi_startproc
## %bb.0:
	pushq	%rbp
	.cfi_def_cfa_offset 16
	.cfi_offset %rbp, -16
	movq	%rsp, %rbp
	.cfi_def_cfa_register %rbp
	subq	$32, %rsp
	movq	%rdi, -8(%rbp)
	movl	%esi, -12(%rbp)
	movq	%rdx, -24(%rbp)
	movq	-8(%rbp), %rax
	movq	-24(%rbp), %rcx
	movq	%rcx, (%rax)
	movl	-12(%rbp), %esi
	movl	%esi, 8(%rax)
	movl	$8, 24(%rax)
	movl	-12(%rbp), %esi
	movl	%esi, 16(%rax)
	movq	(%rax), %rcx
	movl	16(%rax), %esi
	movl	%esi, %edx
	movzbl	(%rcx,%rdx), %esi
	movl	%esi, 20(%rax)
	movq	%rax, %rdi
	movq	%rax, -32(%rbp)         ## 8-byte Spill
	callq	__ZN5Prips12PlanesWalker7advanceEv
	movq	-32(%rbp), %rcx         ## 8-byte Reload
	movl	%eax, 12(%rcx)
	movq	%rcx, %rdi
	callq	__ZN5Prips12PlanesWalker12goToNextByteEv
	movq	-32(%rbp), %rcx         ## 8-byte Reload
	movl	16(%rcx), %eax
	addl	12(%rcx), %eax
	movl	%eax, 12(%rcx)
	movq	%rcx, %rdi
	callq	__ZN5Prips12PlanesWalker12pickFirstBitEv
	movq	-32(%rbp), %rdi         ## 8-byte Reload
	callq	__ZN5Prips12PlanesWalker7advanceEv
	movq	-32(%rbp), %rcx         ## 8-byte Reload
	movl	%eax, 28(%rcx)
	addq	$32, %rsp
	popq	%rbp
	retq
	.cfi_endproc
                                        ## -- End function
	.globl	__ZN5Prips12PlanesWalker7advanceEv ## -- Begin function _ZN5Prips12PlanesWalker7advanceEv
	.weak_definition	__ZN5Prips12PlanesWalker7advanceEv
	.p2align	4, 0x90
__ZN5Prips12PlanesWalker7advanceEv:     ## @_ZN5Prips12PlanesWalker7advanceEv
	.cfi_startproc
## %bb.0:
	pushq	%rbp
	.cfi_def_cfa_offset 16
	.cfi_offset %rbp, -16
	movq	%rsp, %rbp
	.cfi_def_cfa_register %rbp
	subq	$32, %rsp
	movq	%rdi, -8(%rbp)
	movq	-8(%rbp), %rax
	movl	$0, -12(%rbp)
	movl	$0, -16(%rbp)
	movl	$0, -20(%rbp)
	movl	$1, -24(%rbp)
	movq	%rax, -32(%rbp)         ## 8-byte Spill
LBB9_1:                                 ## =>This Inner Loop Header: Depth=1
	movq	-32(%rbp), %rax         ## 8-byte Reload
	movl	20(%rax), %ecx
	andl	$128, %ecx
	shrl	$7, %ecx
	movl	%ecx, -12(%rbp)
	movl	20(%rax), %ecx
	shll	$1, %ecx
	movl	%ecx, 20(%rax)
	movl	24(%rax), %ecx
	addl	$-1, %ecx
	movl	%ecx, 24(%rax)
	cmpl	$0, 24(%rax)
	jne	LBB9_3
## %bb.2:                               ##   in Loop: Header=BB9_1 Depth=1
	movq	-32(%rbp), %rdi         ## 8-byte Reload
	callq	__ZN5Prips12PlanesWalker12goToNextByteEv
LBB9_3:                                 ##   in Loop: Header=BB9_1 Depth=1
	cmpl	$0, -24(%rbp)
	je	LBB9_8
## %bb.4:                               ##   in Loop: Header=BB9_1 Depth=1
	cmpl	$0, -12(%rbp)
	jne	LBB9_6
## %bb.5:                               ##   in Loop: Header=BB9_1 Depth=1
	movl	-20(%rbp), %eax
	addl	$1, %eax
	movl	%eax, -20(%rbp)
	jmp	LBB9_7
LBB9_6:                                 ##   in Loop: Header=BB9_1 Depth=1
	movl	$0, -24(%rbp)
LBB9_7:                                 ##   in Loop: Header=BB9_1 Depth=1
	jmp	LBB9_8
LBB9_8:                                 ##   in Loop: Header=BB9_1 Depth=1
	cmpl	$0, -24(%rbp)
	jne	LBB9_13
## %bb.9:                               ##   in Loop: Header=BB9_1 Depth=1
	movl	-12(%rbp), %eax
	orl	-16(%rbp), %eax
	movl	%eax, -16(%rbp)
	movl	-20(%rbp), %eax
	movl	%eax, %ecx
	addl	$-1, %ecx
	movl	%ecx, -20(%rbp)
	cmpl	$0, %eax
	jne	LBB9_11
## %bb.10:
	jmp	LBB9_15
LBB9_11:                                ##   in Loop: Header=BB9_1 Depth=1
	movl	-16(%rbp), %eax
	shll	$1, %eax
	movl	%eax, -16(%rbp)
## %bb.12:                              ##   in Loop: Header=BB9_1 Depth=1
	jmp	LBB9_13
LBB9_13:                                ##   in Loop: Header=BB9_1 Depth=1
	jmp	LBB9_14
LBB9_14:                                ##   in Loop: Header=BB9_1 Depth=1
	movb	$1, %al
	testb	$1, %al
	jne	LBB9_1
	jmp	LBB9_15
LBB9_15:
	movl	-16(%rbp), %eax
	addq	$32, %rsp
	popq	%rbp
	retq
	.cfi_endproc
                                        ## -- End function
	.globl	__ZN5Prips12PlanesWalker12goToNextByteEv ## -- Begin function _ZN5Prips12PlanesWalker12goToNextByteEv
	.weak_definition	__ZN5Prips12PlanesWalker12goToNextByteEv
	.p2align	4, 0x90
__ZN5Prips12PlanesWalker12goToNextByteEv: ## @_ZN5Prips12PlanesWalker12goToNextByteEv
	.cfi_startproc
## %bb.0:
	pushq	%rbp
	.cfi_def_cfa_offset 16
	.cfi_offset %rbp, -16
	movq	%rsp, %rbp
	.cfi_def_cfa_register %rbp
	movq	%rdi, -8(%rbp)
	movq	-8(%rbp), %rax
	movq	(%rax), %rcx
	movl	16(%rax), %edx
	addl	$1, %edx
	movl	%edx, 16(%rax)
	movl	%edx, %edx
	movl	%edx, %esi
	movzbl	(%rcx,%rsi), %edx
	movl	%edx, 20(%rax)
	movl	$8, 24(%rax)
	popq	%rbp
	retq
	.cfi_endproc
                                        ## -- End function
	.globl	__ZN5Prips12PlanesWalker12pickFirstBitEv ## -- Begin function _ZN5Prips12PlanesWalker12pickFirstBitEv
	.weak_definition	__ZN5Prips12PlanesWalker12pickFirstBitEv
	.p2align	4, 0x90
__ZN5Prips12PlanesWalker12pickFirstBitEv: ## @_ZN5Prips12PlanesWalker12pickFirstBitEv
	.cfi_startproc
## %bb.0:
	pushq	%rbp
	.cfi_def_cfa_offset 16
	.cfi_offset %rbp, -16
	movq	%rsp, %rbp
	.cfi_def_cfa_register %rbp
	movq	%rdi, -8(%rbp)
	movq	-8(%rbp), %rax
	movl	20(%rax), %ecx
	andl	$128, %ecx
	shrl	$7, %ecx
	movl	%ecx, 32(%rax)
	movl	20(%rax), %ecx
	shll	$1, %ecx
	movl	%ecx, 20(%rax)
	movl	24(%rax), %ecx
	addl	$-1, %ecx
	movl	%ecx, 24(%rax)
	popq	%rbp
	retq
	.cfi_endproc
                                        ## -- End function
	.section	__TEXT,__const
	.p2align	4               ## @_ZL5image
__ZL5image:
	.ascii	"aR\026\020\t\000\001\020@\213 \213 \213 \2028\2028\2028\201\000D"

	.section	__TEXT,__cstring,cstring_literals
L_.str:                                 ## @.str
	.asciz	"width: %d\n"

L_.str.1:                               ## @.str.1
	.asciz	"height: %d\n"

L_.str.2:                               ## @.str.2
	.asciz	"%d"

L_.str.3:                               ## @.str.3
	.asciz	"\n"


.subsections_via_symbols
